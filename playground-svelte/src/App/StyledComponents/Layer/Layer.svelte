<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

    import { getLayerClass } from "./Layer.context";

    let props: { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.layerScope, layerClass]}>{@render props.children?.()}</div>
