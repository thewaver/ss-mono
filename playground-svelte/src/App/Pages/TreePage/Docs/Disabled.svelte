<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { createFilesWithDisabled } from "../TreePage.const.svelte";
    import type { TreeDisabledDocsExampleProps } from "../TreePageSvelte.types";

    type Props = TreeDisabledDocsExampleProps;

    let props: Props = $props();

    let expanded = $state<string[]>(["src", "Lib"]);

    const nodes = $derived(createFilesWithDisabled(props.isReachable));
</script>

<Tree renderHighlightFloater={renderPageHighlightFloater} {nodes} bind:expanded ariaLabel={"Repository"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
