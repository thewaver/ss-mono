<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SortableGridSurfaceProps } from "./SortableGridContent.types";

    let props: SortableGridSurfaceProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.sortableGridSurface,
        layerClass,
        props.flags.isReceiving && styles.isReceiving,
        props.flags.isCarrying && styles.isCarrying,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {#if props.flags.isEmpty}
        <div class={styles.sortableGridEmpty}>{props.emptyText}</div>
    {/if}
</div>
