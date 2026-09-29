<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.css";
    import { FOCUS_RING_WIDTH, themeVars } from "@thewaver/ss-playground/App/Theme.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTileBoardTileProps } from "./TileBoardContent.types";

    const EDGE_THICKNESSES = [1];
    const FOCUS_THICKNESSES = [FOCUS_RING_WIDTH];
    const EDGE_STROKE_GEOM = [{ thicknesses: EDGE_THICKNESSES }];
    const FOCUS_STROKE_GEOM = [{ thicknesses: FOCUS_THICKNESSES }];

    let props: PageTileBoardTileProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const renderProps = $derived(props.renderProps);

    const strokeColor = $derived(
        renderProps.isFocusVisible ? themeVars.color.outline.main : themeVars.color.primary.main,
    );
</script>

<div class={[styles.tileBoardTile, layerClass, props.isMarked && styles.isMarked]}>
    <Shape
        computePoints={() => renderProps.points}
        computeStrokeDefs={() => [{ color: strokeColor }]}
        strokeGeom={renderProps.isFocusVisible ? FOCUS_STROKE_GEOM : EDGE_STROKE_GEOM}
    >
        {#snippet renderChildren(_, clipPath)}
            <div
                class={[
                    styles.tileBoardTileContent,
                    props.isMarked && styles.isMarked,
                    renderProps.isHovered && styles.isHovered,
                    renderProps.isDisabled && styles.isDisabled,
                ]}
                style:clip-path={`path("${clipPath}")`}
                aria-hidden={"true"}
            >
                {`${renderProps.tile.row}:${renderProps.tile.col}`}
            </div>
        {/snippet}
    </Shape>
</div>
