<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    const STRESS_NODE_HEIGHT = 28;

    type Props = TreeExampleProps & { nodes: TreeNode<string>[] };

    let { value = $bindable(), expanded = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.treeScroller}>
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={props.nodes}
        bind:value
        bind:expanded
        ariaLabel={"Generated repository"}
        computeEstimatedNodeHeight={() => STRESS_NODE_HEIGHT}
    >
        {#snippet renderNode(node, renderProps)}
            <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
        {/snippet}
    </Tree>
</div>
