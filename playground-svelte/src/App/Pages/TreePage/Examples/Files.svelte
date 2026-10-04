<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    type Props = Partial<TreeExampleProps> & { nodes?: TreeNode<string>[] };

    let { value = $bindable(), expanded = $bindable([]), ...props }: Props = $props();
</script>

<Tree
    renderHighlightFloater={renderPageHighlightFloater}
    nodes={props.nodes ?? FILES}
    bind:value
    bind:expanded
    ariaLabel={"Repository"}
>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
