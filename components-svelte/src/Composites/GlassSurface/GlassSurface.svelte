<script lang="ts">
    import type { Snippet } from "svelte";

    import { GlassUtils, SurfaceUtils, GlassSurfaceStyles as styles } from "@thewaver/ss-components";
    import { ShapeConst } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { GlassSvelteUtils } from "../../Abstracts/Glass/GlassSvelte.utils.js";
    import Shape from "../../Exotics/Shape/Shape.svelte";
    import Markup from "../../Utils/Markup.svelte";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { GlassSurfaceProps } from "./GlassSurface.types.js";

    let props: GlassSurfaceProps & { children?: Snippet } = $props();

    const id = $props.id();

    const defs = $derived(GlassUtils.mergeDefs(props.glassDefs));
    const joinRadii = $derived(SurfaceUtils.computeJoinRadii(props.borderRadii));
    const borderWidths = $derived(SurfaceUtils.computeBorderWidths(props.borderWidths));
    const lameExponents = $derived(SurfaceUtils.computeLameExponents(props.lameExponents));
    const margin = $derived(GlassUtils.computeBackdropMargin(defs));
    const rippleFilter = $derived(GlassSvelteUtils.computeBackdropFilterElement(id, defs));
</script>

<div class={styles.glassSurfaceRoot}>
    <Shape
        computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
        {joinRadii}
        {lameExponents}
        computeStrokeDefs={props.computeStrokeDefs}
        strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
        computeFillDefs={(size, element) =>
            GlassSvelteUtils.computeSheenDefs(id, element, size, defs, () => props.pointSource)}
    >
        {#snippet renderChildren(size, clipPath)}
            {@const backdropStyle = toStyle(
                {
                    clipPath: `path("${GlassUtils.computeMarginedClipPath(size, margin, joinRadii, lameExponents)}")`,
                },
                assignInlineVars({
                    [styles.backdropMarginVar]: `${margin}px`,
                    [styles.blurRadiusVar]: `${defs.backdrop.blurRadius}px`,
                }),
            )}
            <svg class={styles.glassDefs} aria-hidden="true">
                <defs><Markup markup={rippleFilter} /></defs>
            </svg>

            {#if defs.backdrop.blurRadius > 0}
                <div class={styles.glassBlurLayer} style={backdropStyle}></div>
            {/if}

            {#if rippleFilter}
                <div
                    class={styles.glassRippleLayer}
                    style={backdropStyle}
                    style:backdrop-filter={`url(#${GlassUtils.getBackdropFilterId(id)})`}
                ></div>
            {/if}

            <div class={styles.glassContent} style:clip-path={`path("${clipPath}")`}>
                {@render props.children?.()}
            </div>
        {/snippet}
    </Shape>
</div>
