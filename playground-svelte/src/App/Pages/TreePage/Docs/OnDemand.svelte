<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import PageTreeNodePending from "../../../StyledComponents/TreeNodeContent/PageTreeNodePending.svelte";
    import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePage.const.svelte";

    const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
        nodes.map((node) => {
            if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

            if (!node.children) return node;

            return { ...node, children: fillBranch(node.children, value) };
        });

    let expanded = $state<string[]>([]);
    let nodes = $state.raw<TreeNode<string>[]>(REMOTE_ROOT);

    const asked = new Set<string>();
    const timers = new Set<ReturnType<typeof setTimeout>>();

    $effect(() => () => timers.forEach(clearTimeout));

    $effect(() => {
        const pending = expanded.filter((value) => !asked.has(value));

        for (const value of pending) {
            asked.add(value);

            const timer = setTimeout(() => {
                timers.delete(timer);
                nodes = fillBranch(nodes, value);
            }, REMOTE_LOAD_DELAY_MS);

            timers.add(timer);
        }
    });
</script>

<Tree renderHighlightFloater={renderPageHighlightFloater} {nodes} bind:expanded ariaLabel={"Remote repository"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}

    {#snippet renderPendingChildren(_node, depth)}
        <PageTreeNodePending {depth}>Fetching…</PageTreeNodePending>
    {/snippet}
</Tree>
