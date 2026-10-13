import { Fragment, defineComponent } from "vue";

import {
    type GradientFalloffOpts,
    type GradientSmearSampleOpts,
    SVGDefsUtils,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotSmear1Const,
    SpotSmearConst,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
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
    heading: number;
    stretch: number;
};

type TrailMotion = {
    lastOrigin: Point2d | undefined;
    lastMovedMs: number | undefined;
    lastTravel: Point2d | undefined;
    speed: number;
    bornTick: number | undefined;
};

type SpotSmearProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSmearSampleOpts;
};

const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: TrailStampConst.STAMP_COUNT }, () => undefined);

const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? SpotSmear1Const.DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? SpotSmear1Const.DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? SpotSmear1Const.DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? SpotSmear1Const.DEFAULTS.falloffStop,
    },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
    stamp
        ? MathUtils.clamp01((frameMs - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
        : TrackedGradientSampleConst.FULL_AGE_RATIO;

const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSmearSampleOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? SpotSmear1Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? SpotSmear1Const.DEFAULTS.trailDecay);

const getStampAspect = (stamp: TrailStamp | undefined) => {
    const stretch = stamp?.stretch ?? SpotSmearConst.NO_STRETCH;

    return { width: stretch, height: SpotSmearConst.NO_STRETCH / stretch };
};

const SpotSmear = defineComponent(
    (props: SpotSmearProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = [...NO_STAMPS];
        const motion: TrailMotion = {
            lastOrigin: undefined,
            lastMovedMs: undefined,
            lastTravel: undefined,
            speed: SpotSmearConst.NO_SPEED,
            bornTick: undefined,
        };

        watchAfterRender([frameMs, reading, isPointerPresent], () => {
            const opts = props.opts;
            const origin = reading.value.boxRatio;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const lastOrigin = motion.lastOrigin;
            const travel = lastOrigin && { x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y };
            const step = travel && Point2dUtils.getLength(travel);

            motion.lastOrigin = origin;
            motion.speed +=
                ((step ?? SpotSmearConst.NO_SPEED) - motion.speed) *
                (opts?.smearSmoothing ?? SpotSmear1Const.DEFAULTS.smearSmoothing);

            if (step !== undefined && step > SpotConst.MOTION_STEP_RATIO) {
                motion.lastMovedMs = performance.now();
                motion.lastTravel = travel;

                if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();
            }

            const tick = Math.floor(frameMs.value / TrailStampConst.STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (
                motion.lastMovedMs === undefined ||
                performance.now() - motion.lastMovedMs > TrailStampConst.MOTION_GRACE_MS
            )
                return;

            motion.bornTick = tick;

            const stamp = {
                origin,
                fade,
                bornMs: frameMs.value,
                heading: motion.lastTravel ? Point2dUtils.getAngle(motion.lastTravel) : SpotSmearConst.RESTING_HEADING,
                stretch: MathUtils.lerp(
                    SpotSmearConst.NO_STRETCH,
                    opts?.smearMax ?? SpotSmear1Const.DEFAULTS.smearMax,
                    MathUtils.clamp01(
                        motion.speed / (opts?.smearFullStepRatio ?? SpotSmear1Const.DEFAULTS.smearFullStepRatio),
                    ),
                ),
            };

            stamps[tick % TrailStampConst.STAMP_COUNT] = stamp;
        });

        return () => {
            const elementSize =
                (props.opts?.circular ?? SpotSmear1Const.DEFAULTS.circular) ? props.defs.getSize() : undefined;
            const scale = props.opts?.glowScale ?? SpotSmear1Const.DEFAULTS.glowScale;

            return (
                <>
                    {SVGGradientDefsVueUtils.computeRadialGradient({
                        id: `gradient1-${props.id}`,
                        elementSize,
                        origin: reading.value.boxRatio,
                        scale,
                        colors: computePoolColors(props.defs.colors.primary, TrailStampConst.FULL_ALPHA, props.opts),
                    })}
                    {stamps.map((stamp, index) => (
                        <Fragment key={index}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getStampId(props.id, index),
                                elementSize,
                                origin: stamp?.origin ?? SpotConst.RESTING_ORIGIN,
                                scale,
                                aspect: getStampAspect(stamp),
                                angle: stamp?.heading ?? SpotSmearConst.RESTING_HEADING,
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
    { name: "SpotSmear", props: declareProps<SpotSmearProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const spot_smear_1 = (opts?: GradientSmearSampleOpts): TrackedGradientConfig => ({
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
                    renderDefsElement: () => <SpotSmear id={id} element={element} defs={defs} opts={opts} />,
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
