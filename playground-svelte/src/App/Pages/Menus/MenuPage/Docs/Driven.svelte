<script lang="ts">
    import { Button, Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";

    let visibility = $state(false);
    let anchorRef = $state<HTMLElement>();
    let lastRun = $state(NOTHING_RUN);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    bind:visibility
    {anchorRef}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}
</Menu>

<Button
    bind:ref={anchorRef}
    id={"menuToggle"}
    onClick={() => {
        visibility = !visibility;
    }}
>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags}>{visibility ? "Close it" : "Open it"}</PageControlButtonContent>
    {/snippet}
</Button>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
