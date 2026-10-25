<script lang="ts">
    import { ContextMenu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";

    let lastRun = $state(NOTHING_RUN);
</script>

<ContextMenu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    regionAriaLabel={"Editing area"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderRegion()}
        <div class={styles.contextRegion}>Right-click anywhere in this box</div>
    {/snippet}
</ContextMenu>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
