<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    
    import { getPanelId, getTabId, HONEYCOMB_LAYOUT, HONEYCOMB_TABS, HONEYCOMB_WIDTH, PANEL_BODIES } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabCell from "../../../StyledComponents/TabContent/PageTabCell.svelte";
    import PageTabHexFloater from "../../../StyledComponents/TabContent/PageTabHexFloater.svelte";
    import PageTabHexHighlightFloater from "../../../StyledComponents/TabContent/PageTabHexHighlightFloater.svelte";

    const ID_PREFIX = "honeycomb";

    let selectedValue = $state("Overview");
</script>

<div class={styles.tabsDemo}>
    <div style:width={HONEYCOMB_WIDTH}>
        <Tabs
            ariaLabel={"Honeycomb views"}
            tabs={HONEYCOMB_TABS}
            {selectedValue}
            computeLayout={HONEYCOMB_LAYOUT}
            onSelectionChange={(value) => {
                selectedValue = value;
            }}
        >
            {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                <PageTabHexFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderHighlightFloater(visibilityTarget, transitionDurationMs)}
                <PageTabHexHighlightFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderTab(tab, flags)}
                <PageTabCell {flags} isSelected={tab.value === selectedValue}>{tab.value}</PageTabCell>
            {/snippet}
        </Tabs>
    </div>

    <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
        {PANEL_BODIES[selectedValue]}
    </PageTabPanel>
</div>
