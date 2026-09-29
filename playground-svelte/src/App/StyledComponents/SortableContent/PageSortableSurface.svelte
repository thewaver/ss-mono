<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableSurfaceProps } from "./SortableContent.types";

    let props: SortableSurfaceProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.sortableSurface,
        layerClass,
        props.flags.isReceiving && styles.isReceiving,
        props.flags.isCarrying && styles.isCarrying,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {#if props.flags.isEmpty}
        <div class={styles.sortableEmpty}>{props.emptyText}</div>
    {/if}
</div>
