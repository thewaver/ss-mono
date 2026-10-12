<svelte:options namespace="svg" />

<script module lang="ts">
    import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
    import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TimedPatternConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SVGPatternUseCell from "../../SVGPatternUseCell.svelte";
    import { SVGPatterns } from "../../SVGPatterns.const.js";
    import PatternElement from "./triangle_rtl_2.svelte";

    type PatternElementProps = {
        id: string;
        defs: TimedPatternElementDefs;
    };

    const CELL_COUNT = { rows: 8, cols: 8 };

    export const triangle_rtl_2: TimedPatternConfig = {
        computeSVGDefs: (id, __, ___, defs) => [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => markup(PatternElement, { id, defs }),
                },
            },
        ],
    };
</script>

<script lang="ts">
    let props: PatternElementProps = $props();

    const getSplitValues = SVGDefsSvelteUtils.createSplitValues();

    const pattern = $derived(
        SVGPatterns.computeLayoutPattern(
            "triangle_rtl",
            `pattern1-${props.id}`,
            CELL_COUNT,
            props.defs.cellSize,
            (cellId, index, cellCount, isSplit) => {
                const isEven = MathUtils.isEven(index.col + index.row);
                const piece = SVGDefsUtils.getCellPiece("triangle_rtl", index);
                const values = getSplitValues(cellId, index, cellCount, isSplit);

                return markup(SVGPatternUseCell, {
                    id: cellId,
                    href: `#${props.id}-${piece.shape}`,
                    fill:
                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                            ? props.defs.colors.tertiary
                            : isEven
                              ? props.defs.colors.primary
                              : props.defs.colors.secondary,
                    values,
                    dur: `${props.defs.animationDurationMs * 4}ms`,
                });
            },
        ),
    );
</script>

{#each SVGDefsUtils.getCellPieces("triangle_rtl") as piece (piece.shape)}
    <path
        id={`${props.id}-${piece.shape}`}
        d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, props.defs.cellSize))}
    />
{/each}

<Markup markup={pattern} />
