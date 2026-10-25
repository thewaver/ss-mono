<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import {
        ZOOM_ACTIONS,
        ZOOM_RESET_PERCENT,
        ZOOM_STEPS,
        ZOOM_STEP_PERCENT,
        renderMenuItem,
        renderMenuPopup,
    } from "../MenuPage.const.svelte";

    let zoomPercent = $state(ZOOM_RESET_PERCENT);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ZOOM_ACTIONS}
    ariaLabel={"Zoom actions"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        const step = ZOOM_STEPS[action.name];

        zoomPercent = step === undefined ? ZOOM_RESET_PERCENT : Math.max(zoomPercent + step, ZOOM_STEP_PERCENT);
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Zoom</PageMenuTriggerContent>
    {/snippet}
</Menu>

<div class={exampleStyles.exampleReadout} data-readout>{`Zoom: ${zoomPercent}%`}</div>
