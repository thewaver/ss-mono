<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { GlideLabelProps } from "./GlideFloater.types";

    let props: GlideLabelProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.glideLabel, layerClass, props.isSelected && styles.isSelected]}>{@render props.children?.()}</div>
