<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { NESTED_ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";

    let lastRun = $state(NOTHING_RUN);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={NESTED_ACTIONS}
    ariaLabel={"File actions"}
    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>File</PageMenuTriggerContent>
    {/snippet}
</Menu>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
