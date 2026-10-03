<svelte:options namespace="svg" />

<script module lang="ts">
    import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
    import { MathUtils } from "@thewaver/ss-utils";

    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TimedPatternConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SVGPatternCircleCell from "../../SVGPatternCircleCell.svelte";
    import { SVGPatterns } from "../../SVGPatterns.const.js";
    import PatternElement from "./circle_hs_2.svelte";

    type PatternElementProps = {
        id: string;
        defs: TimedPatternElementDefs;
    };

    const CELL_COUNT = { rows: 8, cols: 8 };

    export const circle_hs_2: TimedPatternConfig = {
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

    const pattern = $derived.by(() => {
        const cellSize = props.defs.cellSize;
        const r = Math.min(cellSize.width, cellSize.height) * 0.5;

        return SVGPatterns.computeHalfShiftPattern(
            `pattern1-${props.id}`,
            CELL_COUNT,
            cellSize,
            (cellId, index, cellCount, isSplit) => {
                const isEven = MathUtils.isEven(index.col + index.row);
                const values = getSplitValues(cellId, index, cellCount, isSplit);

                return markup(SVGPatternCircleCell, {
                    id: cellId,
                    r,
                    cx: cellSize.width * 0.5,
                    cy: cellSize.height * 0.5,
                    fill:
                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                            ? props.defs.colors.tertiary
                            : isEven
                              ? props.defs.colors.primary
                              : props.defs.colors.secondary,
                    values: values
                        .split(";")
                        .map((v) => `${Number(v) * r}`)
                        .join(";"),
                    dur: `${props.defs.animationDurationMs * 4}ms`,
                });
            },
        );
    });
</script>

<Markup markup={pattern} />
