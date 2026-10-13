import { Fragment, useEffect, useRef, useState } from "react";

import {
    type GradientHandTrailOpts,
    SVGDefsUtils,
    type SVGGradientColor,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    HandTrail1Const,
    HandTrailConst,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { MathUtils, SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

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
    (opts?.trailAlpha ?? HandTrail1Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? HandTrail1Const.DEFAULTS.trailDecay);

const renderSweep = (id: string, angle: number, colors: SVGGradientColor[], sweepArc: number) => (
    <>
        {SVGGradientDefsReactUtils.computeLinearGradient({
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

const HandTrail = (props: HandTrailProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);
    const [stamps] = useState(() => [...NO_STAMPS]);
    const motionRef = useRef<HandMotion>({ lastAngle: undefined, lastTurnedMs: undefined, bornTick: undefined });

    useEffect(() => {
        const motion = motionRef.current;
        const angle = reading.angle;
        const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
        const turn = motion.lastAngle !== undefined ? Math.abs(getShortestTurn(motion.lastAngle, angle)) : undefined;

        motion.lastAngle = angle;

        if (turn !== undefined && turn > HandTrailConst.MOTION_TURN_DEGREES) {
            motion.lastTurnedMs = performance.now();

            if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();
        }

        const tick = Math.floor(frameMs / TrailStampConst.STAMP_INTERVAL_MS);

        if (tick === motion.bornTick) return;
        if (
            motion.lastTurnedMs === undefined ||
            performance.now() - motion.lastTurnedMs > TrailStampConst.MOTION_GRACE_MS
        )
            return;

        motion.bornTick = tick;

        const stamp = { angle, fade, bornMs: frameMs };

        stamps[tick % TrailStampConst.STAMP_COUNT] = stamp;
    }, [frameMs, reading, isPointerPresent]);

    const sweepArc = props.opts?.sweepArc ?? HandTrail1Const.DEFAULTS.sweepArc;
    const color = props.defs.colors.primary;

    return (
        <>
            {renderSweep(
                `1-${props.id}`,
                reading.angle,
                computeSweepColors(
                    color,
                    TrailStampConst.FULL_ALPHA * SVGDefsUtils.getPointerFade(reading, isPointerPresent),
                ),
                sweepArc,
            )}
            {stamps.map((stamp, index) => (
                <Fragment key={index}>
                    {renderSweep(
                        getStampId(props.id, index),
                        stamp?.angle ?? HandTrailConst.RESTING_ANGLE,
                        computeSweepColors(color, getStampAlpha(stamp, frameMs, props.opts)),
                        sweepArc,
                    )}
                </Fragment>
            ))}
        </>
    );
};

export const hand_trail_1 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
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
