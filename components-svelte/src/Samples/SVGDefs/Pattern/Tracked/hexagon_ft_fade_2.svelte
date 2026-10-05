<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type PatternProximityOpts,
        SVGDefsUtils,
        TrackedPatternDefaults,
        type TrackedPatternElementDefs,
        TrackedPatternUtils,
    } from "@thewaver/ss-components";
    import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedPatternConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SVGPatternTrackedUseCell from "../../SVGPatternTrackedUseCell.svelte";
    import { SVGPatterns } from "../../SVGPatterns.const.js";
    import PatternElement from "./hexagon_ft_fade_2.svelte";

    type PatternElementProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedPatternElementDefs;
        opts?: PatternProximityOpts;
    };

    const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

    export const hexagon_ft_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
        computeSVGDefs: (id, __, element, defs) => [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => markup(PatternElement, { id, element, defs, opts }),
                },
            },
        ],
    });
</script>

<script lang="ts">
    let props: PatternElementProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const opts = $derived(TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS));
    const pointer = $derived(
        TrackedPatternUtils.computePointerPoint(getReading(), getIsPointerPresent(), props.defs.getSize()),
    );

    const computeCellLevel = SVGDefsSvelteUtils.createPatternTrail(
        () => opts,
        () => pointer,
    );

    const pattern = $derived(
        SVGPatterns.computeTrackedLayoutPattern(
            "hex_flat_top",
            `pattern1-${props.id}`,
            props.defs.cellSize,
            props.defs.getSize(),
            pointer,
            opts,
            (cellId, index, isSplit, level) =>
                markup(SVGPatternTrackedUseCell, {
                    id: cellId,
                    href: `#${props.id}-hexagon`,
                    fillOpacity: level,
                    fill:
                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                            ? props.defs.colors.tertiary
                            : MathUtils.isEven(index.row)
                              ? props.defs.colors.primary
                              : props.defs.colors.secondary,
                }),
            computeCellLevel,
        ),
    );
</script>

<path
    id={`${props.id}-hexagon`}
    d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("hexagon-flat-top", props.defs.cellSize))}
/>

<Markup markup={pattern} />
