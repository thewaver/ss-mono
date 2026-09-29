<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";

    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { ASSETS } from "../TreePage.const.svelte";
    import type { TreeRecordExampleProps } from "../TreePage.types";

    type Props = TreeRecordExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<Tree nodes={ASSETS} bind:value bind:expanded ariaLabel={"Assets"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent {renderProps} detail={node.value.kind}>{node.value.name}</PageTreeNodeContent>
    {/snippet}
</Tree>
