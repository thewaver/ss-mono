<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { LAYERS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";

    let lastRun = $state(NOTHING_RUN);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={LAYERS}
    ariaLabel={"Layers"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Layers</PageMenuTriggerContent>
    {/snippet}
</Menu>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
