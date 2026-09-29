<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    let props: { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.wheelMount, layerClass]}>{@render props.children?.()}</div>
