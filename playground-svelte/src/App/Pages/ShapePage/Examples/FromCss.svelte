<script lang="ts">
    import { SVGStyleDefsSvelteUtils, Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    type Converted = ReturnType<typeof SVGStyleDefsSvelteUtils.computeDefsFromStyle>;

    type Props = {
        cssText: string;
    };

    const NOTHING_CONVERTED: Converted = {
        fillDefs: [],
        fillGeom: [],
        strokeDefs: [],
        strokeGeom: [],
        joinRadii: [],
        lameExponents: [],
    };

    let props: Props = $props();

    const id = $props.id();

    let source = $state<HTMLDivElement>();
    let converted = $state.raw(NOTHING_CONVERTED);
    let boxSize = $state.raw<Size2d>({ width: 0, height: 0 });

    $effect(() => {
        const element = source;
        const cssText = props.cssText;

        if (!element) return;

        element.style.cssText = cssText;

        const size = { width: element.offsetWidth, height: element.offsetHeight };

        boxSize = size;
        converted = SVGStyleDefsSvelteUtils.computeDefsFromStyle(getComputedStyle(element), size, id);
    });
</script>

<div class={styles.fromCssRow}>
    <div bind:this={source} class={styles.fromCssBox}>CSS</div>

    <Shape
        joinRadii={converted.joinRadii}
        fillGeom={converted.fillGeom}
        lameExponents={converted.lameExponents}
        strokeGeom={converted.strokeGeom}
        computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
        computeFillDefs={() => converted.fillDefs}
        computeStrokeDefs={() => converted.strokeDefs}
    >
        {#snippet renderChildren()}
            <div class={styles.fromCssCaption} style:width={`${boxSize.width}px`} style:height={`${boxSize.height}px`}>
                SVG
            </div>
        {/snippet}
    </Shape>
</div>
