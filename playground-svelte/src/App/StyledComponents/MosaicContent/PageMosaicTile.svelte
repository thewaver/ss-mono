<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MosaicContent/MosaicContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageMosaicTileProps } from "./MosaicContent.types";

    let props: PageMosaicTileProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.mosaicTile, layerClass]} style:width={`${props.width}px`} style:height={`${props.height}px`}>
    <div class={styles.mosaicTileName}>{@render props.children?.()}</div>

    <div class={styles.mosaicTileReading}>
        {`reads ${props.state.readingIndex + 1} of ${props.state.itemCount}`}
    </div>
</div>
