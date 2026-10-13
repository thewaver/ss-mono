import { Fragment, defineComponent } from "vue";

import {
    type GradientFalloffOpts,
    type GradientSpotTrailOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotTrail2Const,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { watchAfterRender } from "../../../../Utils/effectUtils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

type TrailMotion = {
    lastOrigin: Point2d | undefined;
    lastMovedMs: number | undefined;
    bornTick: number | undefined;
};

type SpotTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotTrailOpts;
};

const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: TrailStampConst.STAMP_COUNT }, () => undefined);

const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientSpotTrailOpts) => {
    const cycleMs = opts?.cycleMs ?? SpotTrail2Const.DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * SpotTrail2Const.COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[SpotTrail2Const.COLOR_KEYS[index % SpotTrail2Const.COLOR_KEYS.length]];
    const to = colors[SpotTrail2Const.COLOR_KEYS[(index + 1) % SpotTrail2Const.COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? SpotTrail2Const.DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? SpotTrail2Const.DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? SpotTrail2Const.DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? SpotTrail2Const.DEFAULTS.falloffStop,
    },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
    stamp
        ? MathUtils.clamp01((frameMs - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
        : TrackedGradientSampleConst.FULL_AGE_RATIO;

const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSpotTrailOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? SpotTrail2Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? SpotTrail2Const.DEFAULTS.trailDecay);

const getColorKey = (ageRatio: number, opts?: GradientSpotTrailOpts) => {
    const band = Math.floor(
        (ageRatio / (opts?.ageColorSpan ?? SpotTrail2Const.DEFAULTS.ageColorSpan)) * SpotTrail2Const.COLOR_KEYS.length,
    );

    return SpotTrail2Const.COLOR_KEYS[Math.min(band, SpotTrail2Const.COLOR_KEYS.length - 1)];
};

const computeStampColors = (
    stamp: TrailStamp | undefined,
    colors: SVGDefsColors,
    frameMs: number,
    opts?: GradientSpotTrailOpts,
) =>
    opts?.cycles
        ? computePoolColors(getCycleColor(colors, stamp?.bornMs ?? 0, opts), getStampAlpha(stamp, frameMs, opts))
        : computePoolColors(
              colors[getColorKey(getAgeRatio(stamp, frameMs), opts)],
              getStampAlpha(stamp, frameMs, opts),
              opts,
          );

const SpotTrail = defineComponent(
    (props: SpotTrailProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = [...NO_STAMPS];
        const motion: TrailMotion = { lastOrigin: undefined, lastMovedMs: undefined, bornTick: undefined };

        watchAfterRender([frameMs, reading, isPointerPresent, () => Boolean(props.opts?.cycles)], () => {
            const isCycling = Boolean(props.opts?.cycles);
            const origin = reading.value.boxRatio;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const lastOrigin = motion.lastOrigin;
            const step =
                lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });
            const isMoving = step !== undefined && step > SpotConst.MOTION_STEP_RATIO;

            motion.lastOrigin = origin;

            if (fade > TrackedGradientSampleConst.NO_FADE && (isCycling || isMoving)) clock.keepAwake();

            if (isMoving) motion.lastMovedMs = performance.now();

            const tick = Math.floor(frameMs.value / TrailStampConst.STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (
                motion.lastMovedMs === undefined ||
                performance.now() - motion.lastMovedMs > TrailStampConst.MOTION_GRACE_MS
            )
                return;

            motion.bornTick = tick;

            const stamp = { origin, fade, bornMs: frameMs.value };

            stamps[tick % TrailStampConst.STAMP_COUNT] = stamp;
        });

        return () => {
            const isCycling = Boolean(props.opts?.cycles);

            const elementSize =
                (props.opts?.circular ?? SpotTrail2Const.DEFAULTS.circular) ? props.defs.getSize() : undefined;
            const scale = props.opts?.glowScale ?? SpotTrail2Const.DEFAULTS.glowScale;

            return (
                <>
                    {SVGGradientDefsVueUtils.computeRadialGradient({
                        id: `gradient1-${props.id}`,
                        elementSize,
                        origin: reading.value.boxRatio,
                        scale,
                        colors: isCycling
                            ? computePoolColors(
                                  getCycleColor(props.defs.colors, frameMs.value, props.opts),
                                  TrailStampConst.FULL_ALPHA,
                              )
                            : computePoolColors(props.defs.colors.primary, TrailStampConst.FULL_ALPHA, props.opts),
                    })}
                    {stamps.map((stamp, index) => (
                        <Fragment key={index}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getStampId(props.id, index),
                                elementSize,
                                origin: stamp?.origin ?? SpotConst.RESTING_ORIGIN,
                                scale,
                                colors: computeStampColors(stamp, props.defs.colors, frameMs.value, props.opts),
                            })}
                        </Fragment>
                    ))}
                </>
            );
        };
    },
    { name: "SpotTrail", props: declareProps<SpotTrailProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const spot_trail_2 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
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
                    renderDefsElement: () => <SpotTrail id={id} element={element} defs={defs} opts={opts} />,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: TrailStampConst.STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getStampId(id, index),
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
