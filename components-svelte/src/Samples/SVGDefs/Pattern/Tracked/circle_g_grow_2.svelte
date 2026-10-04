<svelte:options namespace="svg" />

<script module lang="ts">
    import {
        type PatternProximityOpts,
        SVGDefsUtils,
        TrackedPatternDefaults,
        type TrackedPatternElementDefs,
        TrackedPatternUtils,
    } from "@thewaver/ss-components";
    import { MathUtils } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedPatternConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SVGPatternTrackedCircleCell from "../../SVGPatternTrackedCircleCell.svelte";
    import { SVGPatterns } from "../../SVGPatterns.const.js";
    import PatternElement from "./circle_g_grow_2.svelte";

    type PatternElementProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedPatternElementDefs;
        opts?: PatternProximityOpts;
    };

    const DEFAULTS = TrackedPatternDefaults.GROW_DEFAULTS;

    export const circle_g_grow_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
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

    const r = $derived(Math.min(props.defs.cellSize.width, props.defs.cellSize.height) * 0.5);

    const pattern = $derived(
        SVGPatterns.computeTrackedLayoutPattern(
            "grid",
            `pattern1-${props.id}`,
            props.defs.cellSize,
            props.defs.getSize(),
            pointer,
            opts,
            (cellId, index, isSplit, level) =>
                markup(SVGPatternTrackedCircleCell, {
                    id: cellId,
                    r: level * r,
                    cx: props.defs.cellSize.width * 0.5,
                    cy: props.defs.cellSize.height * 0.5,
                    fill:
                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                            ? props.defs.colors.tertiary
                            : MathUtils.isEven(index.col + index.row)
                              ? props.defs.colors.primary
                              : props.defs.colors.secondary,
                }),
            computeCellLevel,
        ),
    );
</script>

<Markup markup={pattern} />
