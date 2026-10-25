<script lang="ts">
    import { Button, Tabs } from "@thewaver/ss-components-svelte";
    import {
        CLEARABLE_TABS,
        PANEL_BODIES,
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

    const ID_PREFIX = "clearable";

    const TRANSITION_DURATION_MS = 600;

    let selectedValue = $state<string | undefined>("One");
</script>

<div class={styles.tabsDemo}>
    <Tabs
        orientation={"horizontal"}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Clearable views"}
        transitionDurationMs={TRANSITION_DURATION_MS}
        tabs={CLEARABLE_TABS}
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

    {#if selectedValue}
        <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
            {PANEL_BODIES[selectedValue]}
        </PageTabPanel>
    {/if}

    <Button
        id={"clearSelection"}
        ariaLabel={"Clear the selection"}
        onClick={() => {
            selectedValue = undefined;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>Clear</PageControlButtonContent>
        {/snippet}
    </Button>
</div>
