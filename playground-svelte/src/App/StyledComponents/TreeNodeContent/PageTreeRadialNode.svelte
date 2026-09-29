<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TreeNodeContentProps } from "./TreeNodeContent.types";

    const ROOT_RANK_DEPTH = 0;
    const INNER_RANK_DEPTH = 1;

    let props: TreeNodeContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.treeRadialNode,
        layerClass,
        props.renderProps.depth === ROOT_RANK_DEPTH && styles.isRootRank,
        props.renderProps.depth > INNER_RANK_DEPTH && styles.isOuterRank,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
