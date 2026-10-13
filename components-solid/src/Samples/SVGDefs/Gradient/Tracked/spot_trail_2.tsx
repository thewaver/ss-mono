import { createEffect, createSignal } from "solid-js";

import {
    type GradientFalloffOpts,
    type GradientSpotTrailOpts,
    type PointerReading,
    type SVGDefsColors,
    SVGDefsUtils,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotTrail2Const,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const NO_REF = () => undefined;

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

const clock = SVGDefsSolidUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const createTrailStamp = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    isCycling: boolean,
    opts?: GradientSpotTrailOpts,
) => {
    const [getStamp, setStamp] = createSignal<TrailStamp>();

    let bornTick: number | undefined;
    let lastOrigin: Point2d | undefined;
    let lastMovedMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        lastOrigin = origin;

        if (
            fade > TrackedGradientSampleConst.NO_FADE &&
            (isCycling || (step !== undefined && step > SpotConst.MOTION_STEP_RATIO))
        )
            clock.keepAwake();

        if (step !== undefined && step > SpotConst.MOTION_STEP_RATIO) lastMovedMs = performance.now();

        const tick = Math.floor(nowMs / TrailStampConst.STAMP_INTERVAL_MS);

        if (tick % TrailStampConst.STAMP_COUNT !== index || tick === bornTick) return;
        if (lastMovedMs === undefined || performance.now() - lastMovedMs > TrailStampConst.MOTION_GRACE_MS) return;

        bornTick = tick;

        setStamp({ origin, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const stamp = getStamp();

        return stamp
            ? MathUtils.clamp01((clock.getFrameMs() - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
            : TrackedGradientSampleConst.FULL_AGE_RATIO;
    };

    const getAlpha = () =>
        (getStamp()?.fade ?? 0) *
        (opts?.trailAlpha ?? SpotTrail2Const.DEFAULTS.trailAlpha) *
        (1 - getAgeRatio()) ** (opts?.trailDecay ?? SpotTrail2Const.DEFAULTS.trailDecay);

    const getColorKey = () => {
        const band = Math.floor(
            (getAgeRatio() / (opts?.ageColorSpan ?? SpotTrail2Const.DEFAULTS.ageColorSpan)) *
                SpotTrail2Const.COLOR_KEYS.length,
        );

        return SpotTrail2Const.COLOR_KEYS[Math.min(band, SpotTrail2Const.COLOR_KEYS.length - 1)];
    };

    return {
        getOrigin: () => getStamp()?.origin ?? SpotConst.RESTING_ORIGIN,
        getColors: (colors: SVGDefsColors) =>
            isCycling
                ? computePoolColors(getCycleColor(colors, getStamp()?.bornMs ?? 0, opts), getAlpha())
                : computePoolColors(colors[getColorKey()], getAlpha(), opts),
    };
};

export const spot_trail_2 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
            getRef ?? NO_REF,
            undefined,
            defs.getPointSource,
        );

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize:
                                (opts?.circular ?? SpotTrail2Const.DEFAULTS.circular)
                                    ? () => defs.getSize()
                                    : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.glowScale ?? SpotTrail2Const.DEFAULTS.glowScale,
                            colors: opts?.cycles
                                ? () =>
                                      computePoolColors(
                                          getCycleColor(defs.colors, clock.getFrameMs(), opts),
                                          TrailStampConst.FULL_ALPHA,
                                      )
                                : computePoolColors(defs.colors.primary, TrailStampConst.FULL_ALPHA, opts),
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: TrailStampConst.STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const stamp = createTrailStamp(
                            index,
                            getReading,
                            getIsPointerPresent,
                            Boolean(opts?.cycles),
                            opts,
                        );

                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize:
                                (opts?.circular ?? SpotTrail2Const.DEFAULTS.circular)
                                    ? () => defs.getSize()
                                    : undefined,
                            origin: stamp.getOrigin,
                            scale: opts?.glowScale ?? SpotTrail2Const.DEFAULTS.glowScale,
                            colors: () => stamp.getColors(defs.colors),
                        });
                    },
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
