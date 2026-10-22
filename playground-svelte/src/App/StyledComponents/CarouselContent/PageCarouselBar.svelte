<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    let { ref = $bindable(), ...props }: { ref?: HTMLDivElement; children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div bind:this={ref} class={[styles.carouselBar, layerClass]}>{@render props.children?.()}</div>
