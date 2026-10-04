<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { DOCS } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";
    import PageTreeLink from "./PageTreeLink.svelte";

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<Tree
    renderHighlightFloater={renderPageHighlightFloater}
    nodes={DOCS}
    bind:value
    bind:expanded
    ariaLabel={"Routed documentation"}
    linkComponent={PageTreeLink}
>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
