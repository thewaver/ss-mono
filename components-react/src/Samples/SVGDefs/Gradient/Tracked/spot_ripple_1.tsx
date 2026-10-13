import { Fragment, useEffect, useRef, useState } from "react";

import { type GradientRippleSampleOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import {
    SpotConst,
    SpotRipple1Const,
    SpotRippleConst,
    TrackedGradientSampleConst,
} from "@thewaver/ss-components/internal";
import { EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

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

const getRippleId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const clock = SVGDefsUtils.createClock(SpotRippleConst.RIPPLE_LIFETIME_MS);

const getAgeRatio = (ripple: Ripple | undefined, frameMs: number) =>
    ripple
        ? MathUtils.clamp01((frameMs - ripple.bornMs) / SpotRippleConst.RIPPLE_LIFETIME_MS)
        : TrackedGradientSampleConst.FULL_AGE_RATIO;

const getRippleScale = (ageRatio: number, opts?: GradientRippleSampleOpts) =>
    MathUtils.lerp(
        opts?.rippleStartScale ?? SpotRipple1Const.DEFAULTS.rippleStartScale,
        opts?.rippleEndScale ?? SpotRipple1Const.DEFAULTS.rippleEndScale,
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
        (opts?.rippleAlpha ?? SpotRipple1Const.DEFAULTS.rippleAlpha) *
        (1 - ageRatio) ** (opts?.rippleDecay ?? SpotRipple1Const.DEFAULTS.rippleDecay);
    const spread = MathUtils.lerp(
        opts?.crestSpreadStart ?? SpotRipple1Const.DEFAULTS.crestSpreadStart,
        opts?.crestSpreadEnd ?? SpotRipple1Const.DEFAULTS.crestSpreadEnd,
        EasingUtils.easeOutCubic(ageRatio),
    );
    const crestStop = opts?.crestStop ?? SpotRipple1Const.DEFAULTS.crestStop;

    return [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / 0)`, stop: crestStop - spread },
        { value: `rgb(from ${color} r g b / ${alpha})`, stop: crestStop },
        {
            value: `rgb(from ${color} r g b / 0)`,
            stop: Math.min(crestStop + spread, SpotRippleConst.CREST_OUTER_LIMIT),
        },
        { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
    ];
};

const getNoRipples = (count: number): (Ripple | undefined)[] => Array.from({ length: count }, () => undefined);

const SpotRipples = (props: SpotRipplesProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);
    const rippleCount = props.opts?.rippleCount ?? SpotRipple1Const.DEFAULTS.rippleCount;
    const [ripples, setRipples] = useState(() => getNoRipples(rippleCount));
    const motionRef = useRef<RippleMotion>({
        lastOrigin: undefined,
        travel: SpotRippleConst.NO_TRAVEL,
        bornMilestone: SpotRippleConst.FIRST_MILESTONE,
    });

    useEffect(() => {
        const motion = motionRef.current;
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
        const lastOrigin = motion.lastOrigin;
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        motion.lastOrigin = origin;

        if (step === undefined || step <= SpotConst.MOTION_STEP_RATIO) return;

        motion.travel += step;

        if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();

        const milestone = Math.floor(
            motion.travel / (props.opts?.rippleSpacingRatio ?? SpotRipple1Const.DEFAULTS.rippleSpacingRatio),
        );

        if (milestone === motion.bornMilestone) return;

        motion.bornMilestone = milestone;

        const ripple = { origin, fade, bornMs: frameMs };

        setRipples((previous) =>
            previous.map((entry, index) => (index === milestone % previous.length ? ripple : entry)),
        );
    }, [frameMs, reading, isPointerPresent]);

    const elementSize = (props.opts?.circular ?? SpotRipple1Const.DEFAULTS.circular) ? props.defs.getSize() : undefined;
    const color = props.defs.colors.primary;

    return (
        <>
            {SVGGradientDefsReactUtils.computeRadialGradient({
                id: `gradient1-${props.id}`,
                elementSize,
                origin: reading.boxRatio,
                scale: props.opts?.sourceScale ?? SpotRipple1Const.DEFAULTS.sourceScale,
                colors: [
                    { value: `rgb(from ${color} r g b / 1)` },
                    {
                        value: `rgb(from ${color} r g b / ${props.opts?.sourceAlpha ?? SpotRipple1Const.DEFAULTS.sourceAlpha})`,
                        stop: props.opts?.sourceStop ?? SpotRipple1Const.DEFAULTS.sourceStop,
                    },
                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                ],
            })}
            {ripples.map((ripple, index) => {
                const ageRatio = getAgeRatio(ripple, frameMs);

                return (
                    <Fragment key={index}>
                        {SVGGradientDefsReactUtils.computeRadialGradient({
                            id: getRippleId(props.id, index),
                            elementSize,
                            origin: ripple?.origin ?? SpotConst.RESTING_ORIGIN,
                            scale: getRippleScale(ageRatio, props.opts),
                            colors: computeRippleColors(ripple, color, ageRatio, props.opts),
                        })}
                    </Fragment>
                );
            })}
        </>
    );
};

export const spot_ripple_1 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
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
            ...Array.from({ length: opts?.rippleCount ?? SpotRipple1Const.DEFAULTS.rippleCount }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getRippleId(id, index),
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
