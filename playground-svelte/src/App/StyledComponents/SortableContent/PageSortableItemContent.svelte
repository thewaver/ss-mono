<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableItemContentProps } from "./SortableContent.types";

    let props: SortableItemContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.sortableItemContent,
        layerClass,
        props.isCenterd === true && styles.sortableItemCenterd,
        props.flags.isCarried && styles.isCarried,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <div class={styles.sortableItemGrip} aria-hidden="true">{"⠿"}</div>

    <div>{@render props.children?.()}</div>

    {#if props.detail}
        <div class={styles.sortableItemDetail}>{props.detail}</div>
    {/if}
</div>
