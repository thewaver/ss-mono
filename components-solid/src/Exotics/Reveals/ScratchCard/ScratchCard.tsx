import {
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import {
    NavigatorUtils,
    SCRATCH_CARD_DEFAULTS,
    ScratchCardUtils,
    ScratchCardStyles as styles,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { ScratchCardProps } from "./ScratchCardSolid.types";

const NOTHING_RUBBED = 0;
const NO_PATH = "";

export const ScratchCard = (props: ScratchCardProps) => {
    const maskId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getCoverRef, setCoverRef] = createSignal<HTMLElement>();
    const [getPathRef, setPathRef] = createSignal<SVGPathElement>();
    const [getPath, setPath] = createSignal(NO_PATH);
    const [getClearedRatio, setClearedRatio] = createSignal(NOTHING_RUBBED);
    const [getIsClearing, setIsClearing] = createSignal(false);
    const [getIsCleared, setIsCleared] = createSignal(false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getCoverRef, getIsDisabled);

    const getBrushRadius = createMemo(() => access(props.brushRadius) ?? SCRATCH_CARD_DEFAULTS.brushRadius);

    const getSoftness = createMemo(() => access(props.softness) ?? SCRATCH_CARD_DEFAULTS.softness);

    const getPrecision = createMemo(() => access(props.precision) ?? SCRATCH_CARD_DEFAULTS.precision);

    const getClearThreshold = createMemo(() => access(props.clearThreshold) ?? SCRATCH_CARD_DEFAULTS.clearThreshold);

    const getClearDurationMs = createMemo(() => access(props.clearDurationMs) ?? SCRATCH_CARD_DEFAULTS.clearDurationMs);

    const getBrushShape = createMemo(() => ({
        radius: getBrushRadius(),
        computePoints: props.computePoints,
        joinRadii: access(props.joinRadii),
        lameExponents: access(props.lameExponents),
    }));

    const getBrushPoints = createMemo(() => ScratchCardUtils.computeBrushPoints(getBrushShape()));

    const getBlurDeviation = createMemo(() => ScratchCardUtils.computeBlurDeviation(getBrushRadius(), getSoftness()));

    const getMaskStyle = createMemo(() => ScratchCardUtils.computeMaskStyle(maskId));

    const scheduler = ScratchCardUtils.createMeasureScheduler(() =>
        setClearedRatio(ScratchCardUtils.measureClearedRatio(getPathRef(), getPath(), getSize(), getPrecision())),
    );

    const reset = () => {
        scheduler.reset();
        setIsClearing(false);
        setIsCleared(false);
        setPath(NO_PATH);
        setClearedRatio(NOTHING_RUBBED);
    };

    const controller = createMemo(() => ({
        reset: () => {
            reset();

            return true;
        },
        clear: () => {
            if (untrack(getIsClearing)) return false;

            setIsClearing(true);

            return true;
        },
    }));

    onMount(() => {
        props.onMount?.(controller());
    });

    createEffect(
        on(
            getClearedRatio,
            (ratio) => {
                props.onScratch?.(ratio);

                if (ratio < getClearThreshold() || getIsCleared()) return;

                setIsClearing(true);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        if (!getIsClearing()) return;

        const timeout = setTimeout(() => {
            ScratchCardUtils.keepFocus(getCoverRef(), getRootRef());

            setIsCleared(true);
            props.onClear?.();
        }, getClearDurationMs());

        onCleanup(() => clearTimeout(timeout));
    });

    onCleanup(scheduler.cancel);

    const rubAt = (ratio: { x: number; y: number }) => {
        const point = ScratchCardUtils.toPoint(ratio, getSize());

        if (ScratchCardUtils.getIsRubbedAt(getPathRef(), getPath(), point, getBrushRadius())) return;

        setPath((previous) => previous + ScratchCardUtils.computeStampPath(point, getBrushRadius(), getBrushPoints()));
        scheduler.schedule();
    };

    const { getIsDragging } = InteractionTrackerSolidUtils.trackDrag(getCoverRef, getIsDisabled, { onDrag: rubAt });

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getCoverRef, getIsDisabled);

    const getBrushGeometry = createMemo(() =>
        ScratchCardUtils.computeBrushGeometry({
            hasRenderer: props.renderBrush !== undefined,
            isClearing: getIsClearing(),
            isPointerPresent: getIsPointerPresent(),
            reading: getReading(),
            size: getSize(),
            shape: getBrushShape(),
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled() || !NavigatorUtils.getIsActivationKey(e.key)) return;

        e.preventDefault();
        setIsClearing(true);
    };

    return (
        <div ref={setRootRef} class={styles.scratchCardRoot} tabindex={-1}>
            {props.renderContent()}

            <svg class={styles.scratchCardDefs} aria-hidden="true">
                <defs>
                    <filter id={`${maskId}-soften`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation={getBlurDeviation()} />
                    </filter>

                    <mask
                        id={maskId}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={getSize().width}
                        height={getSize().height}
                    >
                        <rect width={getSize().width} height={getSize().height} fill="white" />

                        <path
                            ref={setPathRef}
                            d={getPath()}
                            fill="black"
                            fill-rule="nonzero"
                            filter={`url(#${maskId}-soften)`}
                        />
                    </mask>
                </defs>
            </svg>

            {!getIsCleared() && (
                <div
                    ref={setCoverRef}
                    class={styles.scratchCardCover}
                    classList={{ [styles.scratchCardCoverClearing]: getIsClearing() }}
                    style={assignInlineVars({ [styles.clearDurationVar]: `${getClearDurationMs()}ms` })}
                    role="button"
                    tabindex={getIsDisabled() ? undefined : 0}
                    aria-label={access(props.ariaLabel)}
                    aria-disabled={getIsDisabled() || undefined}
                    onKeyDown={handleKeyDown}
                >
                    {props.renderCover(getMaskStyle)}

                    <Show when={getBrushGeometry()}>
                        {(getGeometry) => (
                            <div
                                class={styles.scratchCardBrush}
                                style={{
                                    left: `${getGeometry().box.x}px`,
                                    top: `${getGeometry().box.y}px`,
                                    width: `${getGeometry().box.width}px`,
                                    height: `${getGeometry().box.height}px`,
                                }}
                                aria-hidden="true"
                            >
                                {props.renderBrush?.(getIsDragging, getGeometry)}
                            </div>
                        )}
                    </Show>
                </div>
            )}
        </div>
    );
};
