<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type GradientBandOpts,
        type PointSource,
        SVGDefsUtils,
        TrackedGradientDefaults,
    } from "@thewaver/ss-components";
    import type { Size2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import BandGradient from "./band_1v1.svelte";

    type BandAxis = "x" | "y";

    type BandGradientProps = {
        id: string;
        element: HTMLElement | undefined;
        color: string;
        axis: BandAxis;
        getPointSource?: () => PointSource | undefined;
        opts?: GradientBandOpts;
    };

    const BAND_SPAN: Size2d = { width: 0.7, height: 0.7 };

    const DEFAULTS = TrackedGradientDefaults.BAND_BLEND_DEFAULTS;

    const getBandColors = (color: string, opts?: GradientBandOpts) =>
        SVGDefsUtils.getFalloffStops(color, {
            coreStop: opts?.coreStop ?? DEFAULTS.coreStop,
            coreAlpha: opts?.coreAlpha ?? DEFAULTS.coreAlpha,
            falloffSpread: opts?.falloffSpread ?? DEFAULTS.falloffSpread,
            falloffAlpha: opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
        });

    export const band_1v1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
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
                        renderDefsElement: () =>
                            markup(BandGradient, {
                                id: `gradient1-${id}`,
                                element,
                                color: defs.colors.primary,
                                axis: "x",
                                getPointSource: defs.getPointSource,
                                opts,
                            }),
                    },
                    filter: sharedBlur,
                    blend: true,
                },
                {
                    gradientOrPattern: {
                        id: `gradient2-${id}`,
                        renderDefsElement: () =>
                            markup(BandGradient, {
                                id: `gradient2-${id}`,
                                element,
                                color: defs.colors.secondary,
                                axis: "y",
                                getPointSource: defs.getPointSource,
                                opts,
                            }),
                    },
                    filter: sharedBlurRef,
                    blend: true,
                },
            ];
        },
    });
</script>

<script lang="ts">
    let props: BandGradientProps = $props();

    const { getReading } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.getPointSource?.(),
    );

    const travel = $derived(
        (getReading().boxRatio[props.axis] - 0.5) * (props.opts?.bandTravel ?? DEFAULTS.bandTravel),
    );

    const gradient = $derived(
        SVGGradientDefsSvelteUtils.computeLinearGradient({
            id: props.id,
            colors: getBandColors(props.color, props.opts),
            angle: props.axis === "x" ? 0 : 90,
            scale: BAND_SPAN,
            offset: props.axis === "x" ? { x: travel, y: 0 } : { x: 0, y: travel },
        }),
    );
</script>

<Markup markup={gradient} />
