<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type GradientFalloffOpts,
        type GradientSpotTrailOpts,
        type SVGDefsColors,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SpotTrail from "./spot_trail_2.svelte";

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
    const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
    const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

    const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
    const FULL_AGE_RATIO = 1;
    const FULL_ALPHA = 1;
    const NO_FADE = 0;
    const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

    const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

    const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientSpotTrailOpts) => {
        const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
        const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
        const index = Math.floor(phase);
        const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
        const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

        if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

        return Color.Hex.interpolate(from, to, phase - index);
    };

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

    const clock = SVGDefsSvelteUtils.createClock(TRAIL_LIFETIME_MS);

    const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
        stamp ? MathUtils.clamp01((frameMs - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;

    const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSpotTrailOpts) =>
        (stamp?.fade ?? 0) *
        (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
        (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

    const getColorKey = (ageRatio: number, opts?: GradientSpotTrailOpts) => {
        const band = Math.floor((ageRatio / (opts?.ageColorSpan ?? DEFAULTS.ageColorSpan)) * COLOR_KEYS.length);

        return COLOR_KEYS[Math.min(band, COLOR_KEYS.length - 1)];
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

    export const spot_trail_2 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

            return [
                {
                    color: SVGDefsUtils.getBaseBorderColor(defs),
                },
                {
                    gradientOrPattern: {
                        id: `gradient1-${id}`,
                        renderDefsElement: () => markup(SpotTrail, { id, element, defs, opts }),
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
</script>

<script lang="ts">
    let props: SpotTrailProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(() => props.element);

    const motion: TrailMotion = { lastOrigin: undefined, lastMovedMs: undefined, bornTick: undefined };

    let stamps = $state.raw(NO_STAMPS);

    clock.subscribe();

    $effect(() => {
        const frameMs = clock.getFrameMs();
        const reading = getReading();
        const isPointerPresent = getIsPointerPresent();
        const isCycling = Boolean(props.opts?.cycles);

        untrack(() => {
            const origin = reading.boxRatio;
            const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
            const lastOrigin = motion.lastOrigin;
            const step =
                lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

            const isMoving = step !== undefined && step > MOTION_STEP_RATIO;

            motion.lastOrigin = origin;

            if (fade > NO_FADE && (isCycling || isMoving)) clock.keepAwake();

            if (isMoving) motion.lastMovedMs = performance.now();

            const tick = Math.floor(frameMs / STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (motion.lastMovedMs === undefined || performance.now() - motion.lastMovedMs > MOTION_GRACE_MS) return;

            motion.bornTick = tick;

            const stamp = { origin, fade, bornMs: frameMs };

            stamps = stamps.map((entry, index) => (index === tick % STAMP_COUNT ? stamp : entry));
        });
    });

    const elementSize = $derived((props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined);
    const scale = $derived(props.opts?.glowScale ?? DEFAULTS.glowScale);
</script>

<Markup
    markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
        id: `gradient1-${props.id}`,
        elementSize,
        origin: getReading().boxRatio,
        scale,
        colors: props.opts?.cycles
            ? computePoolColors(getCycleColor(props.defs.colors, clock.getFrameMs(), props.opts), FULL_ALPHA)
            : computePoolColors(props.defs.colors.primary, FULL_ALPHA, props.opts),
    })}
/>

{#each stamps as stamp, index (index)}
    <Markup
        markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
            id: getStampId(props.id, index),
            elementSize,
            origin: stamp?.origin ?? RESTING_ORIGIN,
            scale,
            colors: computeStampColors(stamp, props.defs.colors, clock.getFrameMs(), props.opts),
        })}
    />
{/each}
