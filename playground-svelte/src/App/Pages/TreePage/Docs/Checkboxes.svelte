<script lang="ts">
    import { MultiTree } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES } from "../TreePage.const.svelte";
</script>

<MultiTree renderHighlightFloater={renderPageHighlightFloater} nodes={FILES} ariaLabel={"Files to include"}>
    {#snippet renderNode(node, renderProps, setExpanderRef)}
        <PageTreeNodeContent isGliding hasCheckbox {renderProps} {setExpanderRef}>{node.value}</PageTreeNodeContent>
    {/snippet}
</MultiTree>
