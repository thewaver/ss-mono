<script lang="ts">
    import { Button, Tree } from "@thewaver/ss-components-svelte";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<PageControlColumn>
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={FILES}
        bind:value
        bind:expanded
        ariaLabel={"Repository, collapsed from outside"}
    >
        {#snippet renderNode(node, renderProps)}
            <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
        {/snippet}
    </Tree>

    <Button
        onClick={async () => {
            setTimeout(() => {
                expanded = expanded.filter((value) => value !== "Lib");
            }, OUTSIDE_COLLAPSE_DELAY_MS);
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageControlButtonContent>
        {/snippet}
    </Button>
</PageControlColumn>
