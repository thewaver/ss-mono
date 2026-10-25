<script lang="ts">
    import { ContextMenu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { NESTED_ACTIONS, NOTHING_RUN, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";

    let lastRun = $state(NOTHING_RUN);
</script>

<div dir={"rtl"}>
    <ContextMenu
        renderHighlightFloater={renderPageHighlightFloater}
        items={NESTED_ACTIONS}
        ariaLabel={"File actions"}
        regionAriaLabel={"Editing area in a right-to-left box"}
        submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
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
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
