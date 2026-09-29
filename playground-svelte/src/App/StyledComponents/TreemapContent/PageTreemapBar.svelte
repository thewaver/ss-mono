<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreemapContent/TreemapContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTreemapBarProps } from "./TreemapContent.types";

    let props: PageTreemapBarProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.treemapBar,
        layerClass,
        props.flags.isHovered && styles.treemapBarHovered,
        props.flags.isDisabled && styles.treemapBarAtRoot,
    ]}
>
    <span class={styles.treemapBarPath}>{props.path}</span><span class={styles.treemapTileWeight}>{props.weight}</span>
</div>
