<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePageSvelte.const";
    import type { ShapeExampleProps } from "../ShapePage.types";
    import { WRAPPED_TEXT } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";

    const FLOAT_SIZE = 256;

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
