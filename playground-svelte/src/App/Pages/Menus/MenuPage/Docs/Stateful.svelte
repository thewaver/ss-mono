<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import {
        NOTHING_RUN,
        VIEW_DEFAULTS,
        VIEW_OPTIONS,
        renderMenuItem,
        renderMenuPopup,
    } from "../MenuPage.const.svelte";

    let checked = $state.raw(VIEW_DEFAULTS);
    let lastRun = $state(NOTHING_RUN);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={VIEW_OPTIONS}
    ariaLabel={"View options"}
    bind:checked
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>View</PageMenuTriggerContent>
    {/snippet}
</Menu>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
