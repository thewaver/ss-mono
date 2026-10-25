<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import type { Tab } from "@thewaver/ss-components-svelte";
    import {
        BASIC_TABS,
        PANEL_BODIES,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsBasicDocsExampleProps } from "../TabsPageSvelte.types";

    const ID_PREFIX = "basic";

    type Props = TabsBasicDocsExampleProps;

    let props: Props = $props();

    let selectedValue = $state("Render");

    const tabs = $derived<Tab<string>[]>(BASIC_TABS.map((tab) => ({ ...tab, isDisabled: props.isDisabled })));
</script>

<div class={styles.tabsDemo} data-orientation={props.orientation}>
    <Tabs
        orientation={props.orientation}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Example views"}
        {tabs}
        {selectedValue}
        onSelectionChange={(value) => {
            selectedValue = value;
        }}
    >
        {#snippet renderGutter()}
            <PageTabGutter orientation={props.orientation} />
        {/snippet}

        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={props.orientation} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={props.orientation} isSelected={tab.value === selectedValue}>
                {tab.value}
            </PageTabContent>
        {/snippet}
    </Tabs>

    <div class={styles.tabsDemoPanel}>
        <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
            {PANEL_BODIES[selectedValue]}
        </PageTabPanel>
    </div>
</div>
