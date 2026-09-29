import { Fragment, defineComponent } from "vue";

import {
    type GradientFalloffOpts,
    type GradientSpotTrailOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

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

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_STEP_RATIO = 0.002;
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;
const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? DEFAULTS.falloffStop,
    },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsUtils.createClock(TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
    stamp ? MathUtils.clamp01((frameMs - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;

const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSpotTrailOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

const SpotTrail = defineComponent(
    (props: SpotTrailProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(() => props.element);
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = [...NO_STAMPS];
        const motion: TrailMotion = { lastOrigin: undefined, lastMovedMs: undefined, bornTick: undefined };

        watchAfterRender([frameMs, reading, isPointerPresent], () => {
            const origin = reading.value.boxRatio;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const lastOrigin = motion.lastOrigin;
            const step =
                lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

            motion.lastOrigin = origin;

            if (step !== undefined && step > MOTION_STEP_RATIO) {
                motion.lastMovedMs = performance.now();

                if (fade > NO_FADE) clock.keepAwake();
            }

            const tick = Math.floor(frameMs.value / STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (motion.lastMovedMs === undefined || performance.now() - motion.lastMovedMs > MOTION_GRACE_MS) return;

            motion.bornTick = tick;

            const stamp = { origin, fade, bornMs: frameMs.value };

            stamps[tick % STAMP_COUNT] = stamp;
        });

        return () => {
            const elementSize = (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined;
            const scale = props.opts?.glowScale ?? DEFAULTS.glowScale;

            return (
                <>
                    {SVGGradientDefsVueUtils.computeRadialGradient({
                        id: `gradient1-${props.id}`,
                        elementSize,
                        origin: reading.value.boxRatio,
                        scale,
                        colors: computePoolColors(props.defs.colors.primary, FULL_ALPHA, props.opts),
                    })}
                    {stamps.map((stamp, index) => (
                        <Fragment key={index}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getStampId(props.id, index),
                                elementSize,
                                origin: stamp?.origin ?? RESTING_ORIGIN,
                                scale,
                                colors: computePoolColors(
                                    props.defs.colors.primary,
                                    getStampAlpha(stamp, frameMs.value, props.opts),
                                    props.opts,
                                ),
                            })}
                        </Fragment>
                    ))}
                </>
            );
        };
    },
    { name: "SpotTrail", props: declareProps<SpotTrailProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const spot_trail_1 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
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
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getStampId(id, index),
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
