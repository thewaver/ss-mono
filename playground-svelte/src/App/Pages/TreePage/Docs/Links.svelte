<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import CustomTreeLink from "../CustomTreeLink.svelte";
    import { DOCS } from "../TreePage.const.svelte";
    import type { TreeLinksDocsExampleProps } from "../TreePageSvelte.types";

    type Props = TreeLinksDocsExampleProps;

    let props: Props = $props();

    let expanded = $state<string[]>(["Guides"]);
</script>

<Tree
    renderHighlightFloater={renderPageHighlightFloater}
    nodes={DOCS}
    bind:expanded
    ariaLabel={"Documentation"}
    linkComponent={props.hasLinkComponent ? CustomTreeLink : undefined}
>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
