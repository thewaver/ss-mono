<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES } from "../TreePage.const.svelte";
</script>

<div dir={"rtl"}>
    <Tree renderHighlightFloater={renderPageHighlightFloater} nodes={FILES} ariaLabel={"Repository"}>
        {#snippet renderNode(node, renderProps)}
            <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
        {/snippet}
    </Tree>
</div>
