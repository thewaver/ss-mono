<script lang="ts">
    import { Button, Tabs } from "@thewaver/ss-components-svelte";
    import {
        PANEL_BODIES,
        RIGHT_TO_LEFT_TABS,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";

    const ID_PREFIX = "rtl";

    let selectedValue = $state("Render");
    let isRightToLeft = $state(true);
</script>

<div class={styles.tabsDemo}>
    <div class={styles.tabsDemo} dir={isRightToLeft ? "rtl" : "ltr"}>
        <Tabs
            orientation={"horizontal"}
            tabGap={ROW_TAB_GAP}
            ariaLabel={"Right-to-left views"}
            tabs={RIGHT_TO_LEFT_TABS}
            {selectedValue}
            onSelectionChange={(value) => {
                selectedValue = value;
            }}
        >
            {#snippet renderGutter()}
                <PageTabGutter orientation={"horizontal"} />
            {/snippet}

            {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderTab(tab, flags)}
                <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === selectedValue}>
                    {tab.value}
                </PageTabContent>
            {/snippet}
        </Tabs>

        <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
            {PANEL_BODIES[selectedValue]}
        </PageTabPanel>
    </div>

    <Button
        id={"switchDirection"}
        ariaLabel={"Switch the direction"}
        onClick={() => {
            isRightToLeft = !isRightToLeft;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>Switch the direction</PageControlButtonContent>
        {/snippet}
    </Button>
</div>
