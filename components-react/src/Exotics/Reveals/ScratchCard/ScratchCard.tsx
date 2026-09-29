import { type CSSProperties, type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
    NavigatorUtils,
    SCRATCH_CARD_DEFAULTS,
    type ScratchCardController,
    ScratchCardStyles,
    ScratchCardUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { ScratchCardProps } from "./ScratchCard.types";

const NOTHING_RUBBED = 0;
const NO_PATH = "";

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const ScratchCard = (props: ScratchCardProps) => {
    const maskId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const coverRef = useRef<HTMLDivElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);

    const [path, setPath] = useState(NO_PATH);
    const [clearedRatio, setClearedRatio] = useState(NOTHING_RUBBED);
    const [isClearing, setIsClearing] = useState(false);
    const [isCleared, setIsCleared] = useState(false);

    const isDisabled = props.isDisabled === true;

    const size = ElementObserverReactUtils.useBorderBoxSize(coverRef, isDisabled);

    const brushRadius = props.brushRadius ?? SCRATCH_CARD_DEFAULTS.brushRadius;
    const softness = props.softness ?? SCRATCH_CARD_DEFAULTS.softness;
    const precision = props.precision ?? SCRATCH_CARD_DEFAULTS.precision;
    const clearThreshold = props.clearThreshold ?? SCRATCH_CARD_DEFAULTS.clearThreshold;
    const clearDurationMs = props.clearDurationMs ?? SCRATCH_CARD_DEFAULTS.clearDurationMs;

    const brushShape = {
        radius: brushRadius,
        computePoints: props.computePoints,
        joinRadii: props.joinRadii,
        lameExponents: props.lameExponents,
    };

    const latest = useLatest({ props, path, size, precision, brushRadius, brushShape, clearThreshold, isCleared });
    const isClearingRef = useLatest(isClearing);

    const [scheduler] = useState(() =>
        ScratchCardUtils.createMeasureScheduler(() =>
            setClearedRatio(
                ScratchCardUtils.measureClearedRatio(
                    pathRef.current ?? undefined,
                    latest.current.path,
                    latest.current.size,
                    latest.current.precision,
                ),
            ),
        ),
    );

    const startClearing = () => {
        isClearingRef.current = true;
        setIsClearing(true);
    };

    const [controller] = useState<ScratchCardController>(() => ({
        reset: () => {
            scheduler.reset();
            isClearingRef.current = false;
            setIsClearing(false);
            setIsCleared(false);
            setPath(NO_PATH);
            setClearedRatio(NOTHING_RUBBED);

            return true;
        },
        clear: () => {
            if (isClearingRef.current) return false;

            startClearing();

            return true;
        },
    }));

    useEffect(() => {
        latest.current.props.onMount?.(controller);
    }, [controller]);

    useEffect(() => scheduler.cancel, [scheduler]);

    useLayoutEffect(() => {
        if (path !== NO_PATH) scheduler.schedule();
    }, [path, scheduler]);

    const reportedRatioRef = useRef(clearedRatio);

    useEffect(() => {
        if (reportedRatioRef.current === clearedRatio) return;

        reportedRatioRef.current = clearedRatio;
        latest.current.props.onScratch?.(clearedRatio);

        if (clearedRatio < latest.current.clearThreshold || latest.current.isCleared) return;

        startClearing();
    }, [clearedRatio]);

    useEffect(() => {
        if (!isClearing) return;

        const timeout = setTimeout(() => {
            ScratchCardUtils.keepFocus(coverRef.current ?? undefined, rootRef.current ?? undefined);

            setIsCleared(true);
            latest.current.props.onClear?.();
        }, clearDurationMs);

        return () => clearTimeout(timeout);
    }, [isClearing, clearDurationMs]);

    const { isDragging } = InteractionTrackerReactUtils.useDrag(coverRef, isDisabled, {
        onDrag: (ratio) => {
            const current = latest.current;
            const point = ScratchCardUtils.toPoint(ratio, current.size);

            if (
                ScratchCardUtils.getIsRubbedAt(pathRef.current ?? undefined, current.path, point, current.brushRadius)
            ) {
                return;
            }

            const stamp = ScratchCardUtils.computeStampPath(
                point,
                current.brushRadius,
                ScratchCardUtils.computeBrushPoints(current.brushShape),
            );

            setPath((previous) => previous + stamp);
        },
    });

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(coverRef, isDisabled);

    const brushGeometry = ScratchCardUtils.computeBrushGeometry({
        hasRenderer: props.renderBrush !== undefined,
        isClearing,
        isPointerPresent,
        reading,
        size,
        shape: brushShape,
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled || !NavigatorUtils.getIsActivationKey(e.key)) return;

        e.preventDefault();
        startClearing();
    };

    const coverClassName = isClearing
        ? `${ScratchCardStyles.scratchCardCover} ${ScratchCardStyles.scratchCardCoverClearing}`
        : ScratchCardStyles.scratchCardCover;

    return (
        <div ref={rootRef} className={ScratchCardStyles.scratchCardRoot} tabIndex={-1}>
            {props.renderContent()}

            <svg className={ScratchCardStyles.scratchCardDefs} aria-hidden="true">
                <defs>
                    <filter id={`${maskId}-soften`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation={ScratchCardUtils.computeBlurDeviation(brushRadius, softness)} />
                    </filter>

                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={size.width} height={size.height}>
                        <rect width={size.width} height={size.height} fill="white" />

                        <path
                            ref={pathRef}
                            d={path}
                            fill="black"
                            fillRule="nonzero"
                            filter={`url(#${maskId}-soften)`}
                        />
                    </mask>
                </defs>
            </svg>

            {!isCleared && (
                <div
                    ref={coverRef}
                    className={coverClassName}
                    style={
                        assignInlineVars({
                            [ScratchCardStyles.clearDurationVar]: `${clearDurationMs}ms`,
                        }) as CSSProperties
                    }
                    role="button"
                    tabIndex={isDisabled ? undefined : 0}
                    aria-label={props.ariaLabel}
                    aria-disabled={isDisabled || undefined}
                    onKeyDown={handleKeyDown}
                >
                    {props.renderCover(toReactStyle(ScratchCardUtils.computeMaskStyle(maskId)))}

                    {brushGeometry && (
                        <div
                            className={ScratchCardStyles.scratchCardBrush}
                            style={{
                                left: `${brushGeometry.box.x}px`,
                                top: `${brushGeometry.box.y}px`,
                                width: `${brushGeometry.box.width}px`,
                                height: `${brushGeometry.box.height}px`,
                            }}
                            aria-hidden="true"
                        >
                            {props.renderBrush?.(isDragging, brushGeometry)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
