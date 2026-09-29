<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
    import type { ShapeExampleProps } from "../ShapePage.types";

    const FLOAT_SIZE = 256;

    const WRAPPED_TEXT = [
        "A floated Shape carries its own outline as its float area, so the lines of this paragraph run up to the",
        "edge that is painted rather than to the square box around it. Pick another shape, or round its corners,",
        "and the text follows, because the outline it wraps against is the same one the fill and the stroke are",
        "drawn from. Nothing here measures the shape or writes a polygon by hand: the page floats the element and",
        "sets how far the text keeps clear of it, and that is all. The rest of this paragraph is only here to be",
        "long enough to wrap all the way around, down past the bottom of the shape and back to the full width of",
        "the column, which is where you can see that the float ends where the outline does.",
    ].join(" ");

    type Props = ShapeExampleProps;

    let props: Props = $props();

    const id = $props.id();
</script>

<div class={styles.wrapText}>
    <Shape
        joinRadii={props.joinRadii}
        lameExponents={props.lameExponents}
        computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
        strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
        computeFillDefs={(size, element) => computeShapeFillDefs(id, props, size, element)}
        computeStrokeDefs={(size, element) => computeShapeStrokeDefs(id, props, size, element)}
    >
        {#snippet renderChildren()}
            <div style:width={`${FLOAT_SIZE}px`} style:height={`${FLOAT_SIZE}px`}></div>
        {/snippet}
    </Shape>{WRAPPED_TEXT}
</div>
