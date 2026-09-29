<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import {
        COLUMN_TABS,
        PANEL_BODIES,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";

    type Props = TabsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.columnDemo}>
    <Tabs
        orientation={"vertical"}
        ariaLabel={"Example sections"}
        tabs={COLUMN_TABS}
        selectedValue={props.selectedValue}
        onSelectionChange={props.onSelectionChange}
    >
        {#snippet renderFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={"vertical"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={"vertical"} isSelected={tab.value === props.selectedValue}>
                {tab.value}
            </PageTabContent>
        {/snippet}
    </Tabs>

    <div class={styles.columnDemoPanel}>
        <PageTabPanel
            id={getPanelId("column", props.selectedValue ?? "")}
            tabId={getTabId("column", props.selectedValue ?? "")}
        >
            {PANEL_BODIES[props.selectedValue ?? ""]}
        </PageTabPanel>
    </div>
</div>
