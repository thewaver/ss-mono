<script lang="ts">
    import type { Snippet } from "svelte";

    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.css";
    import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageFormationItemProps } from "./FormationContentSvelte.types";
    import {
        FILL_OPACITY,
        STROKE_GEOM,
    } from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.const";

    let props: PageFormationItemProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.formationItem, layerClass]}>
    <Shape
        computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
        computeFillDefs={() => [{ color: layerVars.main, opacity: FILL_OPACITY }]}
        computeStrokeDefs={() => [{ color: themeVars.color.primary.main }]}
        strokeGeom={STROKE_GEOM}
    >
        {#snippet renderChildren()}
            <div class={styles.formationItemContent}>
                <div class={styles.formationItemRank}>{props.state.index + 1}</div>

                {@render props.children?.()}
            </div>
        {/snippet}
    </Shape>
</div>
