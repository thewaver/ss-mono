<script lang="ts">
    import type { Snippet } from "svelte";

    import { SurfaceUtils, SurfaceStyles as styles } from "@thewaver/ss-components";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import Shape from "../../Exotics/Shape/Shape.svelte";
    import { type StyleRecord, toStyle } from "../../Utils/styleUtils.js";
    import type { SurfaceProps } from "./Surface.types.js";

    const MOCK_SIZE: Size2d = { width: 0, height: 0 };

    let props: SurfaceProps & { children?: Snippet } = $props();

    const toPixels = (values: object): StyleRecord =>
        Object.fromEntries(Object.entries(values).map(([key, value]) => [key, `${value}px`]));

    const mockFillDefs = $derived(props.computeFillDefs?.(MOCK_SIZE, undefined));
    const mockStrokeDefs = $derived(props.computeStrokeDefs?.(MOCK_SIZE, undefined));

    const isComplex = $derived(SurfaceUtils.getIsComplex(mockFillDefs, mockStrokeDefs, props.lameExponents));

    const borderWidths = $derived(SurfaceUtils.computeBorderWidths(props.borderWidths));

    const fillColorDef = $derived(SurfaceUtils.findColorDef(mockFillDefs));
    const strokeColorDef = $derived(SurfaceUtils.findColorDef(mockStrokeDefs));
</script>

{#if isComplex}
    <Shape
        computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
        computeFillDefs={props.computeFillDefs}
        computeStrokeDefs={props.computeStrokeDefs}
        strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
        joinRadii={SurfaceUtils.computeJoinRadii(props.borderRadii)}
        lameExponents={SurfaceUtils.computeLameExponents(props.lameExponents)}
    >
        {#snippet renderChildren(_size, clipPath)}
            <div style:clip-path={`path("${clipPath}")`}>
                {@render props.children?.()}
            </div>
        {/snippet}
    </Shape>
{:else}
    <div
        class={styles.surfaceDivRoot}
        style={toStyle(
            assignInlineVars({
                [styles.fillColorVar]: fillColorDef?.color ?? "transparent",
                [styles.fillOpacityVar]: SurfaceUtils.computeOpacityPercent(fillColorDef),
            }),
            toPixels(props.borderRadii),
        )}
    >
        {@render props.children?.()}

        {#if SurfaceUtils.getHasBorder(strokeColorDef, props.borderWidths)}
            <div
                class={styles.surfaceDivBorder}
                style={toStyle(
                    assignInlineVars({
                        [styles.strokeColorVar]: strokeColorDef?.color ?? "transparent",
                        [styles.strokeOpacityVar]: SurfaceUtils.computeOpacityPercent(strokeColorDef),
                    }),
                    toPixels(props.borderWidths),
                )}
            ></div>
        {/if}
    </div>
{/if}
