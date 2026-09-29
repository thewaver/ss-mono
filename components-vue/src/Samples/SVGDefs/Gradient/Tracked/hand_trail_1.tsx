import { Fragment, defineComponent } from "vue";

import {
    type GradientHandTrailOpts,
    SVGDefsUtils,
    type SVGGradientColor,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, SVGUtils, type Size2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
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

const SWEEP_SPAN: Size2d = { width: 0.7, height: 0.7 };
const QUARTER_TURN = 90;
const HALF_TURN = 180;
const FULL_TURN = 360;

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_TURN_DEGREES = 0.25;
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ANGLE = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;
const NO_STAMPS: (HandStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const getStampId = (id: string, index: number) => `${index + 2}-${id}`;

const getShortestTurn = (from: number, to: number) => {
    const gap = (((to - from) % FULL_TURN) + FULL_TURN) % FULL_TURN;

    return gap > HALF_TURN ? gap - FULL_TURN : gap;
};

const getSweepRotation = (angle: number, arc: number) => angle - HALF_TURN - arc * 0.5;

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const clock = SVGDefsUtils.createClock(TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: HandStamp | undefined, frameMs: number) =>
    stamp ? MathUtils.clamp01((frameMs - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;

const getStampAlpha = (stamp: HandStamp | undefined, frameMs: number, opts?: GradientHandTrailOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

const renderSweep = (id: string, angle: number, colors: SVGGradientColor[], sweepArc: number) => (
    <>
        {SVGGradientDefsVueUtils.computeLinearGradient({
            id: `gradient${id}`,
            angle: angle + QUARTER_TURN,
            scale: SWEEP_SPAN,
            colors,
        })}
        <clipPath id={`clip${id}`} clipPathUnits="objectBoundingBox">
            <path d={SVGUtils.getArcPath(sweepArc, getSweepRotation(angle, sweepArc))} />
        </clipPath>
    </>
);

const HandTrail = defineComponent(
    (props: HandTrailProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(() => props.element);
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = [...NO_STAMPS];
        const motion: HandMotion = { lastAngle: undefined, lastTurnedMs: undefined, bornTick: undefined };

        watchAfterRender([frameMs, reading, isPointerPresent], () => {
            const angle = reading.value.angle;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const turn =
                motion.lastAngle !== undefined ? Math.abs(getShortestTurn(motion.lastAngle, angle)) : undefined;

            motion.lastAngle = angle;

            if (turn !== undefined && turn > MOTION_TURN_DEGREES) {
                motion.lastTurnedMs = performance.now();

                if (fade > NO_FADE) clock.keepAwake();
            }

            const tick = Math.floor(frameMs.value / STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (motion.lastTurnedMs === undefined || performance.now() - motion.lastTurnedMs > MOTION_GRACE_MS) return;

            motion.bornTick = tick;

            const stamp = { angle, fade, bornMs: frameMs.value };

            stamps[tick % STAMP_COUNT] = stamp;
        });

        return () => {
            const sweepArc = props.opts?.sweepArc ?? DEFAULTS.sweepArc;
            const color = props.defs.colors.primary;

            return (
                <>
                    {renderSweep(
                        `1-${props.id}`,
                        reading.value.angle,
                        computeSweepColors(
                            color,
                            FULL_ALPHA * SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value),
                        ),
                        sweepArc,
                    )}
                    {stamps.map((stamp, index) => (
                        <Fragment key={index}>
                            {renderSweep(
                                getStampId(props.id, index),
                                stamp?.angle ?? RESTING_ANGLE,
                                computeSweepColors(color, getStampAlpha(stamp, frameMs.value, props.opts)),
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

export const hand_trail_1 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
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
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${getStampId(id, index)}`,
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                clipPath: {
                    id: `clip${getStampId(id, index)}`,
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
