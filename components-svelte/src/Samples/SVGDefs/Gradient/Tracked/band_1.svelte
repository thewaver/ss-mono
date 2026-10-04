<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type GradientBandOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import type { Size2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import BandGradient from "./band_1.svelte";

    type BandGradientProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        opts?: GradientBandOpts;
    };

    const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

    const DEFAULTS = TrackedGradientDefaults.BAND_DEFAULTS;

    export const band_1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => markup(BandGradient, { id: `gradient1-${id}`, element, defs, opts }),
                },
                filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ],
    });
</script>

<script lang="ts">
    let props: BandGradientProps = $props();

    const { getReading } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const gradient = $derived(
        SVGGradientDefsSvelteUtils.computeLinearGradient({
            id: props.id,
            angle: 0,
            scale: BAND_SPAN,
            offset: {
                x: (getReading().boxRatio.x - 0.5) * (props.opts?.bandTravel ?? DEFAULTS.bandTravel),
                y: 0,
            },
            colors: SVGDefsUtils.getFalloffStops(props.defs.colors.primary, {
                coreStop: props.opts?.coreStop ?? DEFAULTS.coreStop,
                coreAlpha: props.opts?.coreAlpha ?? DEFAULTS.coreAlpha,
                falloffSpread: props.opts?.falloffSpread ?? DEFAULTS.falloffSpread,
                falloffAlpha: props.opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
            }),
        }),
    );
</script>

<Markup markup={gradient} />
