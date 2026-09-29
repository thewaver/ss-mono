<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import { INDENT_PER_DEPTH, LEAF_MARKER } from "./PageTreeNodeContent.svelte";
    import type { TreeNodePendingProps } from "./TreeNodeContent.types";

    let props: TreeNodePendingProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.treeNodePending, layerClass]}
    style:padding-left={`calc(${themeVars.spacing.half} + ${props.depth * INDENT_PER_DEPTH}px)`}
>
    <div class={styles.treeNodeMarker} aria-hidden="true">
        {LEAF_MARKER}
    </div>

    <div>{@render props.children?.()}</div>
</div>
