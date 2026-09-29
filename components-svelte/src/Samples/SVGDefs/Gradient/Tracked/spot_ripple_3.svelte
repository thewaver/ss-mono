<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type GradientRippleSampleOpts,
        type SVGDefsColors,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { Color, EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SpotRipples from "./spot_ripple_3.svelte";

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
    const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];

    const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
    const FULL_AGE_RATIO = 1;
    const NO_FADE = 0;
    const NO_TRAVEL = 0;
    const FIRST_MILESTONE = 0;

    const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const getRippleId = (id: string, index: number) => `gradient${index + 2}-${id}`;

    const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientRippleSampleOpts) => {
        const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
        const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
        const index = Math.floor(phase);
        const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
        const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

        if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

        return Color.Hex.interpolate(from, to, phase - index);
    };

    const clock = SVGDefsSvelteUtils.createClock(RIPPLE_LIFETIME_MS);

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

    export const spot_ripple_3 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
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
                        renderDefsElement: () => markup(SpotRipples, { id, element, defs, opts }),
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
</script>

<script lang="ts">
    let props: SpotRipplesProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(() => props.element);

    const motion: RippleMotion = { lastOrigin: undefined, travel: NO_TRAVEL, bornMilestone: FIRST_MILESTONE };

    let ripples = $state.raw(getNoRipples(untrack(() => props.opts?.rippleCount ?? DEFAULTS.rippleCount)));

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

            motion.lastOrigin = origin;

            if (isCycling && fade > NO_FADE) clock.keepAwake();

            if (step === undefined || step <= MOTION_STEP_RATIO) return;

            motion.travel += step;

            if (fade > NO_FADE) clock.keepAwake();

            const milestone = Math.floor(
                motion.travel / (props.opts?.rippleSpacingRatio ?? DEFAULTS.rippleSpacingRatio),
            );

            if (milestone === motion.bornMilestone) return;

            motion.bornMilestone = milestone;

            const ripple = { origin, fade, bornMs: frameMs };

            ripples = ripples.map((entry, index) => (index === milestone % ripples.length ? ripple : entry));
        });
    });

    const elementSize = $derived((props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined);
    const color = $derived(
        props.opts?.cycles
            ? getCycleColor(props.defs.colors, clock.getFrameMs(), props.opts)
            : props.defs.colors.primary,
    );
</script>

<Markup
    markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
        id: `gradient1-${props.id}`,
        elementSize,
        origin: getReading().boxRatio,
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
/>

{#each ripples as ripple, index (index)}
    {@const ageRatio = getAgeRatio(ripple, clock.getFrameMs())}
    <Markup
        markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
            id: getRippleId(props.id, index),
            elementSize,
            origin: ripple?.origin ?? RESTING_ORIGIN,
            scale: getRippleScale(ageRatio, props.opts),
            colors: computeRippleColors(
                ripple,
                props.opts?.cycles
                    ? getCycleColor(props.defs.colors, ripple?.bornMs ?? 0, props.opts)
                    : props.defs.colors[COLOR_KEYS[index % COLOR_KEYS.length]],
                ageRatio,
                props.opts,
            ),
        })}
    />
{/each}
