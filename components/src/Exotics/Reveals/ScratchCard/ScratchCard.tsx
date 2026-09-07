import { Show, createEffect, createMemo, createSignal, createUniqueId, on, onCleanup, onMount } from "solid-js";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserver } from "../../../Abstracts/ElementObserver/ElementObserver";
import { InteractionTracker } from "../../../Abstracts/InteractionTracker/InteractionTracker";
import { PointerTracker } from "../../../Abstracts/PointerTracker/PointerTracker";
import { access } from "../../../Utils/propUtils";
import type { ScratchCardBrushGeometry, ScratchCardProps } from "./ScratchCard.types";
import { ScratchCardUtils } from "./ScratchCard.utils";

import * as styles from "./ScratchCard.css";

const DEFAULT_BRUSH_RADIUS = 26;
const DEFAULT_SOFTNESS = 0.45;
const DEFAULT_PRECISION = 32;
const DEFAULT_CLEAR_THRESHOLD = 1;
const DEFAULT_CLEAR_DURATION_MS = 450;
const NOTHING_RUBBED = 0;
const CLEAR_KEYS = ["Enter", " "];
const INSIDE_EDGE_RATIO = 1;
const NO_PATH = "";
const MEASURE_INTERVAL_MS = 100;

export const ScratchCard = (props: ScratchCardProps) => {
    const maskId = createUniqueId();

    const [getCoverRef, setCoverRef] = createSignal<HTMLElement>();
    const [getPathRef, setPathRef] = createSignal<SVGPathElement>();
    const [getPath, setPath] = createSignal(NO_PATH);
    const [getClearedRatio, setClearedRatio] = createSignal(NOTHING_RUBBED);
    const [getIsClearing, setIsClearing] = createSignal(false);
    const [getIsCleared, setIsCleared] = createSignal(false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const getSize = ElementObserver.createBorderBoxSizeObserver(getCoverRef, () => !getIsDisabled());

    const getBrushRadius = createMemo(() => access(props.brushRadius) ?? DEFAULT_BRUSH_RADIUS);

    const getSoftness = createMemo(() => access(props.softness) ?? DEFAULT_SOFTNESS);

    const getPrecision = createMemo(() => access(props.precision) ?? DEFAULT_PRECISION);

    const getClearThreshold = createMemo(() => access(props.clearThreshold) ?? DEFAULT_CLEAR_THRESHOLD);

    const getClearDurationMs = createMemo(() => access(props.clearDurationMs) ?? DEFAULT_CLEAR_DURATION_MS);

    const getBrushShape = createMemo(() => ({
        radius: getBrushRadius(),
        computePoints: props.computePoints,
        joinRadii: access(props.joinRadii),
        lameExponents: access(props.lameExponents),
    }));

    const getBrushPoints = createMemo(() => ScratchCardUtils.computeBrushPoints(getBrushShape()));

    const getBlurDeviation = createMemo(() => ScratchCardUtils.computeBlurDeviation(getBrushRadius(), getSoftness()));

    const getMaskStyle = createMemo(() => ({
        "mask-image": `url(#${maskId})`,
        "-webkit-mask-image": `url(#${maskId})`,
    }));

    const isRubbedAt = (point: { x: number; y: number }) => {
        const pathRef = getPathRef();

        if (!pathRef || !getPath()) return false;

        return ScratchCardUtils.computeProbePoints(point, getBrushRadius()).every((probe) =>
            pathRef.isPointInFill(new DOMPoint(probe.x, probe.y)),
        );
    };

    const measureClearedRatio = () => {
        const pathRef = getPathRef();

        if (!pathRef || !getPath()) return NOTHING_RUBBED;

        const samples = ScratchCardUtils.computeSamplePoints(getSize(), getPrecision());
        const inside = samples.filter((sample) => pathRef.isPointInFill(new DOMPoint(sample.x, sample.y))).length;

        return ScratchCardUtils.computeClearedRatio(inside, samples.length);
    };

    const reset = () => {
        cancelPendingMeasure();
        measuredAt = 0;
        setIsClearing(false);
        setIsCleared(false);
        setPath(NO_PATH);
        setClearedRatio(NOTHING_RUBBED);
    };

    const controller = createMemo(() => ({ reset, clear: () => setIsClearing(true) }));

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
            setIsCleared(true);
            props.onClear?.();
        }, getClearDurationMs());

        onCleanup(() => clearTimeout(timeout));
    });

    let measuredAt = 0;
    let pendingMeasure: ReturnType<typeof setTimeout> | undefined;

    const cancelPendingMeasure = () => {
        clearTimeout(pendingMeasure);
        pendingMeasure = undefined;
    };

    const measureNow = () => {
        cancelPendingMeasure();
        measuredAt = performance.now();
        setClearedRatio(measureClearedRatio());
    };

    const scheduleMeasure = () => {
        const due = measuredAt + MEASURE_INTERVAL_MS - performance.now();

        if (due <= 0) {
            measureNow();

            return;
        }

        if (pendingMeasure !== undefined) return;

        pendingMeasure = setTimeout(measureNow, due);
    };

    onCleanup(cancelPendingMeasure);

    const rubAt = (ratio: { x: number; y: number }) => {
        const size = getSize();
        const point = { x: ratio.x * size.width, y: ratio.y * size.height };

        if (isRubbedAt(point)) return;

        setPath((previous) => previous + ScratchCardUtils.computeStampPath(point, getBrushRadius(), getBrushPoints()));
        scheduleMeasure();
    };

    const { getIsDragging } = InteractionTracker.trackDrag(getCoverRef, getIsDisabled, { onDrag: rubAt });

    const { getReading, getIsPointerPresent } = PointerTracker.create(getCoverRef, getIsDisabled);

    const getBrushGeometry = createMemo<ScratchCardBrushGeometry | undefined>(() => {
        const isPointerOver = getIsPointerPresent() && getReading().edgeRatio <= INSIDE_EDGE_RATIO;

        if (!props.renderBrush || getIsClearing() || !isPointerOver) return undefined;

        const size = getSize();
        const point = { x: getReading().boxRatio.x * size.width, y: getReading().boxRatio.y * size.height };

        return {
            point,
            radius: getBrushRadius(),
            box: ScratchCardUtils.computeBrushBox(point, getBrushRadius()),
            clipPath: ScratchCardUtils.computeBrushClipPath(getBrushShape()),
        };
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled() || !CLEAR_KEYS.includes(e.key)) return;

        e.preventDefault();
        setIsClearing(true);
    };

    return (
        <div class={styles.scratchCardRoot}>
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
