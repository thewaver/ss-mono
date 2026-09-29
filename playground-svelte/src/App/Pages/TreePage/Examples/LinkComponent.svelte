<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { DOCS } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";
    import PageTreeLink from "./PageTreeLink.svelte";

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<Tree nodes={DOCS} bind:value bind:expanded ariaLabel={"Routed documentation"} linkComponent={PageTreeLink}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
