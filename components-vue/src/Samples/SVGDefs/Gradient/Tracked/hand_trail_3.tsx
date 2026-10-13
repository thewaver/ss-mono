import { Fragment, defineComponent } from "vue";

import {
    type GradientHandTrailOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    type SVGGradientColor,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    HandTrail3Const,
    HandTrailConst,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { Color, MathUtils, SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { watchAfterRender } from "../../../../Utils/effectUtils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type HandStamp = {
    angle: number;
    fade: number;
    bornMs: number;
};

type HandMotion = {
    lastAngle: number | undefined;
    lastTurnedMs: number | undefined;
    bornTick: number | undefined;
};

type HandTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandTrailOpts;
};

const NO_STAMPS: (HandStamp | undefined)[] = Array.from({ length: TrailStampConst.STAMP_COUNT }, () => undefined);

const getStampId = (id: string, index: number) => `${index + 2}-${id}`;

const getShortestTurn = (from: number, to: number) => {
    const gap = (((to - from) % HandTrailConst.FULL_TURN) + HandTrailConst.FULL_TURN) % HandTrailConst.FULL_TURN;

    return gap > HandTrailConst.HALF_TURN ? gap - HandTrailConst.FULL_TURN : gap;
};

const getSweepRotation = (angle: number, arc: number) => angle - HandTrailConst.HALF_TURN - arc * 0.5;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientHandTrailOpts) => {
    const cycleMs = opts?.cycleMs ?? HandTrail3Const.DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * HandTrail3Const.COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[HandTrail3Const.COLOR_KEYS[index % HandTrail3Const.COLOR_KEYS.length]];
    const to = colors[HandTrail3Const.COLOR_KEYS[(index + 1) % HandTrail3Const.COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const clock = SVGDefsUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: HandStamp | undefined, frameMs: number) =>
    stamp
        ? MathUtils.clamp01((frameMs - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
        : TrackedGradientSampleConst.FULL_AGE_RATIO;

const getStampAlpha = (stamp: HandStamp | undefined, frameMs: number, opts?: GradientHandTrailOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? HandTrail3Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? HandTrail3Const.DEFAULTS.trailDecay);

const getColorKey = (ageRatio: number, opts?: GradientHandTrailOpts) => {
    const band = Math.floor(
        (ageRatio / (opts?.ageColorSpan ?? HandTrail3Const.DEFAULTS.ageColorSpan)) * HandTrail3Const.COLOR_KEYS.length,
    );

    return HandTrail3Const.COLOR_KEYS[Math.min(band, HandTrail3Const.COLOR_KEYS.length - 1)];
};

const computeStampColors = (
    stamp: HandStamp | undefined,
    colors: SVGDefsColors,
    frameMs: number,
    opts?: GradientHandTrailOpts,
) =>
    opts?.cycles
        ? computeSweepColors(getCycleColor(colors, stamp?.bornMs ?? 0, opts), getStampAlpha(stamp, frameMs, opts))
        : computeSweepColors(
              colors[getColorKey(getAgeRatio(stamp, frameMs), opts)],
              getStampAlpha(stamp, frameMs, opts),
          );

const renderSweep = (id: string, angle: number, colors: SVGGradientColor[], sweepArc: number) => (
    <>
        {SVGGradientDefsVueUtils.computeLinearGradient({
            id: `gradient${id}`,
            angle: angle + HandTrailConst.QUARTER_TURN,
            scale: HandTrailConst.SWEEP_SPAN,
            colors,
        })}
        <SVGClipPath id={`clip${id}`}>
            <path d={SVGUtils.getArcPath(sweepArc, getSweepRotation(angle, sweepArc))} />
        </SVGClipPath>
    </>
);

const HandTrail = defineComponent(
    (props: HandTrailProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = [...NO_STAMPS];
        const motion: HandMotion = { lastAngle: undefined, lastTurnedMs: undefined, bornTick: undefined };

        watchAfterRender([frameMs, reading, isPointerPresent, () => Boolean(props.opts?.cycles)], () => {
            const isCycling = Boolean(props.opts?.cycles);
            const angle = reading.value.angle;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const turn =
                motion.lastAngle !== undefined ? Math.abs(getShortestTurn(motion.lastAngle, angle)) : undefined;
            const isTurning = turn !== undefined && turn > HandTrailConst.MOTION_TURN_DEGREES;

            motion.lastAngle = angle;

            if (fade > TrackedGradientSampleConst.NO_FADE && (isCycling || isTurning)) clock.keepAwake();

            if (isTurning) motion.lastTurnedMs = performance.now();

            const tick = Math.floor(frameMs.value / TrailStampConst.STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (
                motion.lastTurnedMs === undefined ||
                performance.now() - motion.lastTurnedMs > TrailStampConst.MOTION_GRACE_MS
            )
                return;

            motion.bornTick = tick;

            const stamp = { angle, fade, bornMs: frameMs.value };

            stamps[tick % TrailStampConst.STAMP_COUNT] = stamp;
        });

        return () => {
            const sweepArc = props.opts?.sweepArc ?? HandTrail3Const.DEFAULTS.sweepArc;

            return (
                <>
                    {renderSweep(
                        `1-${props.id}`,
                        reading.value.angle,
                        computeSweepColors(
                            getCycleColor(props.defs.colors, frameMs.value, props.opts),
                            TrailStampConst.FULL_ALPHA *
                                SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value),
                        ),
                        sweepArc,
                    )}
                    {stamps.map((stamp, index) => (
                        <Fragment key={index}>
                            {renderSweep(
                                getStampId(props.id, index),
                                stamp?.angle ?? HandTrailConst.RESTING_ANGLE,
                                computeStampColors(stamp, props.defs.colors, frameMs.value, props.opts),
                                sweepArc,
                            )}
                        </Fragment>
                    ))}
                </>
            );
        };
    },
    { name: "HandTrail", props: declareProps<HandTrailProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const hand_trail_3 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => <HandTrail id={id} element={element} defs={defs} opts={opts} />,
                },
                clipPath: {
                    id: `clip1-${id}`,
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: TrailStampConst.STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${getStampId(id, index)}`,
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                clipPath: {
                    id: `clip${getStampId(id, index)}`,
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
