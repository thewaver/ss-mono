<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreemapContent/TreemapContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTreemapTileProps } from "./TreemapContent.types";

    const WORD_START = /(?=[A-Z][^A-Z])/g;

    let props: PageTreemapTileProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.treemapTile, layerClass, props.isBranch && styles.treemapTileBranch]}>
    {#each props.name.split(WORD_START) as word, index (index)}<span>{word}</span>{/each}<span
        class={styles.treemapTileWeight}>{props.weight}</span
    >
</div>
