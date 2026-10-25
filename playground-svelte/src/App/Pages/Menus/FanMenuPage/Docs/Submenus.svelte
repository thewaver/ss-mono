<script lang="ts">
    import { FanMenu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { NOTHING_RUN } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import {
        NESTED_ACTIONS,
        FAN_LAYOUT_DEFS,
        FAN_LAYOUT_SIZE,
        renderFanFloater,
        renderFanItem,
        renderFanPopup,
    } from "../FanMenuPage.const.svelte";

    let lastRun = $state(NOTHING_RUN);
</script>

<div class={styles.stage}>
    <FanMenu
        layoutSize={FAN_LAYOUT_SIZE}
        layoutDefs={FAN_LAYOUT_DEFS}
        items={NESTED_ACTIONS}
        ariaLabel={"Edit actions"}
        placement={{ x: "center", y: "center" }}
        renderItem={renderFanItem}
        renderHighlightFloater={renderFanFloater}
        renderPopup={renderFanPopup}
        onActivate={(action) => {
            lastRun = action.name;
        }}
    >
        {#snippet renderContent(flags)}
            <PageMenuTriggerContent {flags}>Fan</PageMenuTriggerContent>
        {/snippet}
    </FanMenu>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
