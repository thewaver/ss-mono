import { Fragment, defineComponent, shallowRef } from "vue";

import {
    type GradientRippleSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { watchAfterRender } from "../../../../Utils/effectUtils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type Ripple = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

type RippleMotion = {
    lastOrigin: Point2d | undefined;
    travel: number;
    bornMilestone: number;
};

type SpotRipplesProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientRippleSampleOpts;
};

const RIPPLE_LIFETIME_MS = 700;
const CREST_OUTER_LIMIT = 99;
const MOTION_STEP_RATIO = 0.002;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const NO_FADE = 0;
const NO_TRAVEL = 0;
const FIRST_MILESTONE = 0;

const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const getRippleId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const clock = SVGDefsUtils.createClock(RIPPLE_LIFETIME_MS);

const getAgeRatio = (ripple: Ripple | undefined, frameMs: number) =>
    ripple ? MathUtils.clamp01((frameMs - ripple.bornMs) / RIPPLE_LIFETIME_MS) : FULL_AGE_RATIO;

const getRippleScale = (ageRatio: number, opts?: GradientRippleSampleOpts) =>
    MathUtils.lerp(
        opts?.rippleStartScale ?? DEFAULTS.rippleStartScale,
        opts?.rippleEndScale ?? DEFAULTS.rippleEndScale,
        EasingUtils.easeOutCubic(ageRatio),
    );

const computeRippleColors = (
    ripple: Ripple | undefined,
    color: string,
    ageRatio: number,
    opts?: GradientRippleSampleOpts,
) => {
    const alpha =
        (ripple?.fade ?? 0) *
        (opts?.rippleAlpha ?? DEFAULTS.rippleAlpha) *
        (1 - ageRatio) ** (opts?.rippleDecay ?? DEFAULTS.rippleDecay);
    const spread = MathUtils.lerp(
        opts?.crestSpreadStart ?? DEFAULTS.crestSpreadStart,
        opts?.crestSpreadEnd ?? DEFAULTS.crestSpreadEnd,
        EasingUtils.easeOutCubic(ageRatio),
    );
    const crestStop = opts?.crestStop ?? DEFAULTS.crestStop;

    return [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / 0)`, stop: crestStop - spread },
        { value: `rgb(from ${color} r g b / ${alpha})`, stop: crestStop },
        { value: `rgb(from ${color} r g b / 0)`, stop: Math.min(crestStop + spread, CREST_OUTER_LIMIT) },
        { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
    ];
};

const getNoRipples = (count: number): (Ripple | undefined)[] => Array.from({ length: count }, () => undefined);

const SpotRipples = defineComponent(
    (props: SpotRipplesProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(() => props.element);
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const rippleCount = props.opts?.rippleCount ?? DEFAULTS.rippleCount;
        const ripples = shallowRef(getNoRipples(rippleCount));
        const motion: RippleMotion = {
            lastOrigin: undefined,
            travel: NO_TRAVEL,
            bornMilestone: FIRST_MILESTONE,
        };

        watchAfterRender([frameMs, reading, isPointerPresent], () => {
            const origin = reading.value.boxRatio;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const lastOrigin = motion.lastOrigin;
            const step =
                lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

            motion.lastOrigin = origin;

            if (step === undefined || step <= MOTION_STEP_RATIO) return;

            motion.travel += step;

            if (fade > NO_FADE) clock.keepAwake();

            const milestone = Math.floor(
                motion.travel / (props.opts?.rippleSpacingRatio ?? DEFAULTS.rippleSpacingRatio),
            );

            if (milestone === motion.bornMilestone) return;

            motion.bornMilestone = milestone;

            const ripple = { origin, fade, bornMs: frameMs.value };
            const previous = ripples.value;

            ripples.value = previous.map((entry, index) => (index === milestone % previous.length ? ripple : entry));
        });

        return () => {
            const elementSize = (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined;
            const color = props.defs.colors.primary;

            return (
                <>
                    {SVGGradientDefsVueUtils.computeRadialGradient({
                        id: `gradient1-${props.id}`,
                        elementSize,
                        origin: reading.value.boxRatio,
                        scale: props.opts?.sourceScale ?? DEFAULTS.sourceScale,
                        colors: [
                            { value: `rgb(from ${color} r g b / 1)` },
                            {
                                value: `rgb(from ${color} r g b / ${props.opts?.sourceAlpha ?? DEFAULTS.sourceAlpha})`,
                                stop: props.opts?.sourceStop ?? DEFAULTS.sourceStop,
                            },
                            { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                        ],
                    })}
                    {ripples.value.map((ripple, index) => {
                        const ageRatio = getAgeRatio(ripple, frameMs.value);

                        return (
                            <Fragment key={index}>
                                {SVGGradientDefsVueUtils.computeRadialGradient({
                                    id: getRippleId(props.id, index),
                                    elementSize,
                                    origin: ripple?.origin ?? RESTING_ORIGIN,
                                    scale: getRippleScale(ageRatio, props.opts),
                                    colors: computeRippleColors(ripple, color, ageRatio, props.opts),
                                })}
                            </Fragment>
                        );
                    })}
                </>
            );
        };
    },
    { name: "SpotRipples", props: declareProps<SpotRipplesProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const spot_ripple_1 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
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
                    renderDefsElement: () => <SpotRipples id={id} element={element} defs={defs} opts={opts} />,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: opts?.rippleCount ?? DEFAULTS.rippleCount }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getRippleId(id, index),
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
