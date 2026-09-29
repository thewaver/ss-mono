<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import PageTreeNodePending from "../../../StyledComponents/TreeNodeContent/PageTreeNodePending.svelte";
    import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    type Props = TreeExampleProps;

    const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
        nodes.map((node) => {
            if (node.value === value)
                return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

            if (!node.children) return node;

            return { ...node, children: fillBranch(node.children, value) };
        });

    let { value = $bindable(), expanded = $bindable() }: Props = $props();

    let nodes = $state.raw<TreeNode<string>[]>(REMOTE_ROOT);

    const loaded = new Set<string>();

    $effect(() => {
        const timers = expanded
            .filter((value) => !loaded.has(value))
            .map((value) =>
                setTimeout(() => {
                    loaded.add(value);
                    nodes = fillBranch(nodes, value);
                }, REMOTE_LOAD_DELAY_MS),
            );

        return () => timers.forEach((timer) => clearTimeout(timer));
    });
</script>

<Tree {nodes} bind:value bind:expanded ariaLabel={"Remote repository"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}

    {#snippet renderPendingChildren(_node, depth)}
        <PageTreeNodePending {depth}>Fetching…</PageTreeNodePending>
    {/snippet}
</Tree>
