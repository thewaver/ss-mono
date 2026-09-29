<script lang="ts" module>
    export const INDENT_PER_DEPTH = 20;
    export const LEAF_MARKER = "•";
</script>

<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TreeNodeContentProps } from "./TreeNodeContent.types";

    const BRANCH_MARKER = "▶";
    const DESCRIPTION_ONLY_MARKER = "·";

    let props: TreeNodeContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.treeNodeContent,
        layerClass,
        props.renderProps.isBranch && styles.isBranch,
        props.renderProps.isExpanded && styles.isExpanded,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.depth === 0 && styles.isCategory,
    ]}
    style:padding-left={`calc(${themeVars.spacing.half} + ${props.renderProps.depth * INDENT_PER_DEPTH}px)`}
>
    <div class={styles.treeNodeMarker} aria-hidden="true">
        {props.renderProps.isBranch
            ? BRANCH_MARKER
            : (props.hasExamples ?? true)
              ? LEAF_MARKER
              : DESCRIPTION_ONLY_MARKER}
    </div>

    <div>{@render props.children?.()}</div>

    {#if props.detail}
        <div class={styles.treeNodeDetail}>{props.detail}</div>
    {/if}
</div>
