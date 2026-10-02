<script lang="ts">
    import { ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
    import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

    import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
    import DefaultExample from "./Default.svelte";

    const NO_EDGE_THICKNESSES = [0];

    let {
        shapeKind,
        joinRadius,
        playback = $bindable(),
        ...otherProps
    }: ParticleFieldExampleProps & { shapeKind: ShapeConst.DefaultShape; joinRadius: number } = $props();

    let root = $state<HTMLDivElement>();

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root);

    const computeShapePoints = $derived((size: Size2d) => ShapeConst.getDefaultShapePoints(shapeKind, size));

    const shapeJoinRadii = $derived([joinRadius]);

    const contourPath = $derived(
        ShapeUtils.getPaths(computeShapePoints(getSize()), NO_EDGE_THICKNESSES, shapeJoinRadii).outerPath,
    );
</script>

<div bind:this={root} class={styles.shapedRoot}>
    <svg class={styles.shapeContour} aria-hidden="true">
        <path d={contourPath} />
    </svg>

    <DefaultExample {...otherProps} bind:playback {computeShapePoints} {shapeJoinRadii} />
</div>
