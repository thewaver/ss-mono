<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type GradientFlareOpts,
        type SVGDefsColors,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { MathUtils, type Point2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import FlarePart from "./spot_flare_2.svelte";

    type FlareGhost = {
        reach: number;
        scale: number;
        alpha: number;
        colorKey: keyof SVGDefsColors;
        isRing?: boolean;
    };

    type FlarePartProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        ghost?: FlareGhost;
        opts?: GradientFlareOpts;
    };

    const GHOSTS: FlareGhost[] = [
        { reach: 0.8, scale: 0.16, alpha: 0.18, colorKey: "secondary" },
        { reach: 1.6, scale: 0.58, alpha: 0.07, colorKey: "secondary", isRing: true },
    ];

    const DISC_STOPS = [45, 78];
    const DISC_ALPHA_RATIOS = [1, 0.3];
    const RING_STOPS = [55, 82, 92];
    const RING_ALPHA_RATIOS = [0.12, 1, 0.2];

    const DEFAULTS = TrackedGradientDefaults.SPOT_FLARE_DEFAULTS;

    const toGhostColor = (color: string, alpha: number, opts?: GradientFlareOpts) =>
        `hsl(from ${color} h calc(s * ${opts?.ghostSaturation ?? DEFAULTS.ghostSaturation}) calc(l * ${
            opts?.ghostLuminosity ?? DEFAULTS.ghostLuminosity
        }) / ${alpha})`;

    const computeGhostColors = (ghost: FlareGhost, color: string, fade: number, opts?: GradientFlareOpts) => {
        const alpha = ghost.alpha * fade;

        if (ghost.isRing) {
            return [
                { value: toGhostColor(color, 0, opts) },
                { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[0], opts), stop: RING_STOPS[0] },
                { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[1], opts), stop: RING_STOPS[1] },
                { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[2], opts), stop: RING_STOPS[2] },
                { value: toGhostColor(color, 0, opts), stop: 100 },
            ];
        }

        return [
            { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0], opts) },
            { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0], opts), stop: DISC_STOPS[0] },
            { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[1], opts), stop: DISC_STOPS[1] },
            { value: toGhostColor(color, 0, opts), stop: 100 },
        ];
    };

    const computeSpotGradient = (props: FlarePartProps, ratio: Point2d) => {
        const color = props.defs.colors.primary;

        return SVGGradientDefsSvelteUtils.computeRadialGradient({
            id: props.id,
            elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
            origin: ratio,
            scale: props.opts?.glowScale ?? DEFAULTS.glowScale,
            colors: [
                { value: `rgb(from ${color} r g b / 1)` },
                {
                    value: `rgb(from ${color} r g b / ${props.opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                    stop: props.opts?.coreStop ?? DEFAULTS.coreStop,
                },
                {
                    value: `rgb(from ${color} r g b / ${props.opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                    stop: props.opts?.falloffStop ?? DEFAULTS.falloffStop,
                },
                { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
            ],
        });
    };

    const computeGhostGradient = (props: FlarePartProps, ghost: FlareGhost, ratio: Point2d, fade: number) => {
        const growth = MathUtils.lerp(
            props.opts?.ghostNearGrowth ?? DEFAULTS.ghostNearGrowth,
            props.opts?.ghostFarGrowth ?? DEFAULTS.ghostFarGrowth,
            MathUtils.clamp01(Math.hypot(ratio.x - 0.5, ratio.y - 0.5) * 2),
        );

        return SVGGradientDefsSvelteUtils.computeRadialGradient({
            id: props.id,
            elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
            origin: {
                x: ratio.x + (0.5 - ratio.x) * ghost.reach,
                y: ratio.y + (0.5 - ratio.y) * ghost.reach,
            },
            scale: ghost.scale * growth,
            colors: computeGhostColors(ghost, props.defs.colors[ghost.colorKey], fade, props.opts),
        });
    };

    export const spot_flare_2 = (opts?: GradientFlareOpts): TrackedGradientConfig => ({
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
                        renderDefsElement: () => markup(FlarePart, { id: `gradient1-${id}`, element, defs, opts }),
                    },
                    filter: sharedBlur,
                },
                ...GHOSTS.map((ghost, index) => ({
                    gradientOrPattern: {
                        id: `gradient${index + 2}-${id}`,
                        renderDefsElement: () =>
                            markup(FlarePart, { id: `gradient${index + 2}-${id}`, element, defs, ghost, opts }),
                    },
                    filter: sharedBlurRef,
                    blend: true,
                })),
            ];
        },
    });
</script>

<script lang="ts">
    let props: FlarePartProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const gradient = $derived(
        props.ghost
            ? computeGhostGradient(
                  props,
                  props.ghost,
                  getReading().boxRatio,
                  SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
              )
            : computeSpotGradient(props, getReading().boxRatio),
    );
</script>

<Markup markup={gradient} />
