<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ColorSwatchProps } from "./ColorAreaContent.types";

    let props: ColorSwatchProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.colorSwatchChecker, layerClass]}>
    <div class={styles.colorSwatch} style={toStyle(assignInlineVars({ [styles.swatchVar]: props.value }))}></div>
</div>
