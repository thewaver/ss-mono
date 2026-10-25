<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { createStressFiles } from "../TreePage.const.svelte";
    import type { TreeVirtualizedDocsExampleProps } from "../TreePageSvelte.types";

    const NODE_HEIGHT = 28;

    type Props = TreeVirtualizedDocsExampleProps;

    let props: Props = $props();

    let expanded = $state<string[]>(["package-1", "package-2", "package-3"]);

    const nodes = $derived(createStressFiles(props.count));
</script>

<div class={styles.treeScroller}>
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        {nodes}
        bind:expanded
        ariaLabel={"Generated repository"}
        computeEstimatedNodeHeight={() => NODE_HEIGHT}
    >
        {#snippet renderNode(node, renderProps)}
            <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
        {/snippet}
    </Tree>
</div>
