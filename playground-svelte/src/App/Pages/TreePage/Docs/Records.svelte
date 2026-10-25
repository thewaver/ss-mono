<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { ASSETS } from "../TreePage.const.svelte";

    let value = $state<Asset | undefined>();
</script>

<Tree renderHighlightFloater={renderPageHighlightFloater} nodes={ASSETS} bind:value ariaLabel={"Assets"}>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps} detail={node.value.kind}>{node.value.name}</PageTreeNodeContent>
    {/snippet}
</Tree>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${JSON.stringify(value) ?? "none"}`}</div>
