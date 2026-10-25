<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import {
        HOVER_PILL_TABS,
        PANEL_BODIES,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";

    const ID_PREFIX = "hoverPill";

    let selectedValue = $state("Render");
</script>

<div class={styles.tabsDemo}>
    <Tabs
        orientation={"horizontal"}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Hover pill views"}
        tabs={HOVER_PILL_TABS}
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

        {#snippet renderHighlightFloater(visibilityTarget, transitionDurationMs)}
            <PageGlideFloater kind={"highlight"} {visibilityTarget} {transitionDurationMs} />
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
