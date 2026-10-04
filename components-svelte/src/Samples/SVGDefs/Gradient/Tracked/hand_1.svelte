<svelte:options namespace="svg" />

<script module lang="ts">
    import SVGClipPath from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath.svelte";
    import {
        type GradientHandOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { SVGUtils } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import HandPart from "./hand_1.svelte";

    type HandPartProps = {
        part: "gradient" | "clip";
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        opts?: GradientHandOpts;
    };

    const QUARTER_TURN = 90;
    const HALF_TURN = 180;

    const DEFAULTS = TrackedGradientDefaults.HAND_DEFAULTS;

    const computeSweepColors = (color: string, alpha: number) => [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / ${alpha})` },
        { value: `rgb(from ${color} r g b / 0)` },
    ];

    export const hand_1 = (opts?: GradientHandOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        markup(HandPart, { part: "gradient", id: `gradient1-${id}`, element, defs, opts }),
                },
                clipPath: {
                    id: `clip1-${id}`,
                    renderDefsElement: () => markup(HandPart, { part: "clip", id: `clip1-${id}`, element, defs, opts }),
                },
                filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ],
    });
</script>

<script lang="ts">
    let props: HandPartProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const sweepArc = $derived(props.opts?.sweepArc ?? DEFAULTS.sweepArc);

    const gradient = $derived(
        props.part === "gradient" &&
            SVGGradientDefsSvelteUtils.computeLinearGradient({
                id: props.id,
                angle: getReading().angle + QUARTER_TURN,
                colors: computeSweepColors(
                    props.defs.colors.primary,
                    (props.opts?.peakAlpha ?? DEFAULTS.peakAlpha) *
                        SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
                ),
            }),
    );
</script>

{#if props.part === "gradient"}
    <Markup markup={gradient} />
{:else}
    <SVGClipPath id={props.id}>
        <path d={SVGUtils.getArcPath(sweepArc, getReading().angle - HALF_TURN - sweepArc * 0.5)} />
    </SVGClipPath>
{/if}
