<script lang="ts">
    import { Button, Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const.svelte";

    const toBranchValues = (nodes: TreeNode<string>[]): string[] =>
        nodes.flatMap((node) => (node.children ? [node.value, ...toBranchValues(node.children)] : []));

    let expanded = $state<string[]>(["src", "Lib"]);
</script>

<Tree renderHighlightFloater={renderPageHighlightFloater} nodes={FILES} bind:expanded ariaLabel={"Repository"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>

<PageControlRow>
    <Button
        id={"controlledExpandAll"}
        onClick={() => {
            expanded = toBranchValues(FILES);
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Expand all</PageButtonContent>
        {/snippet}
    </Button>

    <Button
        id={"controlledCollapseAll"}
        onClick={() => {
            expanded = [];
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Collapse all</PageButtonContent>
        {/snippet}
    </Button>

    <Button
        id={"controlledCollapseLibLater"}
        onClick={() => {
            setTimeout(() => {
                expanded = expanded.filter((value) => value !== "Lib");
            }, OUTSIDE_COLLAPSE_DELAY_MS);
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageButtonContent>
        {/snippet}
    </Button>
</PageControlRow>
