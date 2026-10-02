<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import PagePaintAreaGroup from "../../../PageComponents/PaintAreaGroup/PaintAreaGroup.svelte";
    import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
    import type { ShapeExampleProps } from "../ShapePage.types";

    const CELL_COUNT = 4;

    let props: ShapeExampleProps = $props();

    const id = $props.id();
</script>

<PagePaintAreaGroup groupClass={styles.sharedGrid} cellCount={CELL_COUNT}>
    {#snippet cell(cell)}
        <Shape
            joinRadii={props.joinRadii}
            lameExponents={props.lameExponents}
            computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
            computeStrokeDefs={() =>
                computeShapeStrokeDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement)}
            strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
            computeFillDefs={() => computeShapeFillDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement)}
        >
            {#snippet renderChildren()}
                <div class={styles.sharedCell}></div>
            {/snippet}
        </Shape>
    {/snippet}
</PagePaintAreaGroup>
