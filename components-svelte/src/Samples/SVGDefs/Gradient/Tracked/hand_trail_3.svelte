<svelte:options namespace="svg" />

<script module lang="ts">
    import SVGClipPath from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath.svelte";
    import { untrack } from "svelte";

    import {
        type GradientHandTrailOpts,
        type SVGDefsColors,
        SVGDefsUtils,
        type SVGGradientColor,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { Color, MathUtils, SVGUtils, type Size2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import HandTrail from "./hand_trail_3.svelte";

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
    const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
    const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

    const RESTING_ANGLE = 0;
    const FULL_AGE_RATIO = 1;
    const FULL_ALPHA = 1;
    const NO_FADE = 0;
    const NO_STAMPS: (HandStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

    const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const getStampId = (id: string, index: number) => `${index + 2}-${id}`;

    const getShortestTurn = (from: number, to: number) => {
        const gap = (((to - from) % FULL_TURN) + FULL_TURN) % FULL_TURN;

        return gap > HALF_TURN ? gap - FULL_TURN : gap;
    };

    const getSweepRotation = (angle: number, arc: number) => angle - HALF_TURN - arc * 0.5;

    const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientHandTrailOpts) => {
        const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
        const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
        const index = Math.floor(phase);
        const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
        const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

        if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

        return Color.Hex.interpolate(from, to, phase - index);
    };

    const computeSweepColors = (color: string, alpha: number) => [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / ${alpha})` },
        { value: `rgb(from ${color} r g b / 0)` },
    ];

    const clock = SVGDefsSvelteUtils.createClock(TRAIL_LIFETIME_MS);

    const getAgeRatio = (stamp: HandStamp | undefined, frameMs: number) =>
        stamp ? MathUtils.clamp01((frameMs - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;

    const getStampAlpha = (stamp: HandStamp | undefined, frameMs: number, opts?: GradientHandTrailOpts) =>
        (stamp?.fade ?? 0) *
        (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
        (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

    const getColorKey = (ageRatio: number, opts?: GradientHandTrailOpts) => {
        const band = Math.floor((ageRatio / (opts?.ageColorSpan ?? DEFAULTS.ageColorSpan)) * COLOR_KEYS.length);

        return COLOR_KEYS[Math.min(band, COLOR_KEYS.length - 1)];
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

    export const hand_trail_3 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
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
                        renderDefsElement: () => markup(HandTrail, { id, element, defs, opts }),
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
</script>

<script lang="ts">
    let props: HandTrailProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(() => props.element);

    const motion: HandMotion = { lastAngle: undefined, lastTurnedMs: undefined, bornTick: undefined };

    let stamps = $state.raw(NO_STAMPS);

    clock.subscribe();

    $effect(() => {
        const frameMs = clock.getFrameMs();
        const reading = getReading();
        const isPointerPresent = getIsPointerPresent();
        const isCycling = Boolean(props.opts?.cycles);

        untrack(() => {
            const angle = reading.angle;
            const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
            const turn =
                motion.lastAngle !== undefined ? Math.abs(getShortestTurn(motion.lastAngle, angle)) : undefined;
            const isTurning = turn !== undefined && turn > MOTION_TURN_DEGREES;

            motion.lastAngle = angle;

            if (fade > NO_FADE && (isCycling || isTurning)) clock.keepAwake();

            if (isTurning) motion.lastTurnedMs = performance.now();

            const tick = Math.floor(frameMs / STAMP_INTERVAL_MS);

            if (tick === motion.bornTick) return;
            if (motion.lastTurnedMs === undefined || performance.now() - motion.lastTurnedMs > MOTION_GRACE_MS) return;

            motion.bornTick = tick;

            const stamp = { angle, fade, bornMs: frameMs };

            stamps = stamps.map((entry, index) => (index === tick % STAMP_COUNT ? stamp : entry));
        });
    });

    const sweepArc = $derived(props.opts?.sweepArc ?? DEFAULTS.sweepArc);
</script>

{#snippet sweep(id: string, angle: number, colors: SVGGradientColor[])}
    <Markup
        markup={SVGGradientDefsSvelteUtils.computeLinearGradient({
            id: `gradient${id}`,
            angle: angle + QUARTER_TURN,
            scale: SWEEP_SPAN,
            colors,
        })}
    />

    <SVGClipPath id={`clip${id}`}>
        <path d={SVGUtils.getArcPath(sweepArc, getSweepRotation(angle, sweepArc))} />
    </SVGClipPath>
{/snippet}

{@render sweep(
    `1-${props.id}`,
    getReading().angle,
    computeSweepColors(
        getCycleColor(props.defs.colors, clock.getFrameMs(), props.opts),
        FULL_ALPHA * SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
    ),
)}

{#each stamps as stamp, index (index)}
    {@render sweep(
        getStampId(props.id, index),
        stamp?.angle ?? RESTING_ANGLE,
        computeStampColors(stamp, props.defs.colors, clock.getFrameMs(), props.opts),
    )}
{/each}
