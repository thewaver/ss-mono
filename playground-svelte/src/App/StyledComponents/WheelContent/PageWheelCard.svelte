<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageWheelCardProps } from "./WheelContent.types";

    let props: PageWheelCardProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.wheelCard,
        layerClass,
        props.state.face === "back" && styles.wheelCardBack,
        props.state.isSelected && styles.isSelected,
    ]}
>
    {#if props.state.face === "front"}
        <div class={styles.wheelCardRank}>{props.rank ?? props.state.index + 1}</div>

        {@render props.children?.()}
    {/if}
</div>
