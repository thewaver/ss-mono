<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";

    import { getLayerClass } from "../../StyledComponents/Layer/Layer.context";

    let props: { width: number; children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.bar, layerClass]} style:width={`${props.width}px`}>
    {@render props.children?.()}
</div>
