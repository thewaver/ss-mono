<script lang="ts">
    import { Button, Tree } from "@thewaver/ss-components-svelte";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<PageControlColumn>
    <Tree nodes={FILES} bind:value bind:expanded ariaLabel={"Repository, collapsed from outside"}>
        {#snippet renderNode(node, renderProps)}
            <PageTreeNodeContent {renderProps}>{node.value}</PageTreeNodeContent>
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
            <PageButtonContent {flags}>{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageButtonContent>
        {/snippet}
    </Button>
</PageControlColumn>
