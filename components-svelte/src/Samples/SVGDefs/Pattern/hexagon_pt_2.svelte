<svelte:options namespace="svg" />

<script module lang="ts">
    import { type PatternElementDefs, SVGDefsUtils } from "@thewaver/ss-components";
    import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

    import Markup from "../../../Utils/Markup.svelte";
    import { markup } from "../../../Utils/markupUtils.js";
    import type { PatternConfig } from "../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../SVGDefsSvelte.utils.svelte.js";
    import SVGPatternUseCell from "../SVGPatternUseCell.svelte";
    import { SVGPatterns } from "../SVGPatterns.const.js";
    import PatternElement from "./hexagon_pt_2.svelte";

    type PatternElementProps = {
        id: string;
        defs: PatternElementDefs;
    };

    const CELL_COUNT = { rows: 8, cols: 8 };

    export const hexagon_pt_2: PatternConfig = {
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
        SVGPatterns.computeHexPointyTopPattern(
            `pattern1-${props.id}`,
            CELL_COUNT,
            props.defs.cellSize,
            (cellId, index, cellCount, isSplit) => {
                const isEven = MathUtils.isEven(index.row);
                const values = getSplitValues(cellId, index, cellCount, isSplit);

                return markup(SVGPatternUseCell, {
                    id: cellId,
                    href: `#${props.id}-hexagon`,
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

<path
    id={`${props.id}-hexagon`}
    d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("hexagon-pointy-top", props.defs.cellSize))}
/>

<Markup markup={pattern} />
