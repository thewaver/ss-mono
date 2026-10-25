<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import type { Tab } from "@thewaver/ss-components-svelte";
    import {
        PANEL_BODIES,
        REACHABLE_TABS,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsDisabledTabDocsExampleProps } from "../TabsPageSvelte.types";

    const ID_PREFIX = "reachable";

    type Props = TabsDisabledTabDocsExampleProps;

    let props: Props = $props();

    let selectedValue = $state("Render");

    const tabs = $derived<Tab<string>[]>(
        REACHABLE_TABS.map((tab) =>
            tab.isDisabled ? { ...tab, isReachableWhenDisabled: props.isReachableWhenDisabled } : tab,
        ),
    );
</script>

<div class={styles.tabsDemo}>
    <Tabs
        orientation={"horizontal"}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Partly disabled views"}
        {tabs}
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
