<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type GradientSpotOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SpotGradient from "./spot_1.svelte";

    type SpotGradientProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        opts?: GradientSpotOpts;
    };

    const DEFAULTS = TrackedGradientDefaults.SPOT_DEFAULTS;

    export const spot_1 = (opts?: GradientSpotOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => markup(SpotGradient, { id: `gradient1-${id}`, element, defs, opts }),
                },
                filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ],
    });
</script>

<script lang="ts">
    let props: SpotGradientProps = $props();

    const { getReading } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const color = $derived(props.defs.colors.primary);

    const gradient = $derived(
        SVGGradientDefsSvelteUtils.computeRadialGradient({
            id: props.id,
            elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
            origin: getReading().boxRatio,
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
        }),
    );
</script>

<Markup markup={gradient} />
