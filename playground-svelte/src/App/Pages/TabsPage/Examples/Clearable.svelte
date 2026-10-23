<script lang="ts" module>
    export const CLEARABLE_TRANSITION_DURATION_MS = 600;
</script>

<script lang="ts">
    import { Button, Tabs } from "@thewaver/ss-components-svelte";
    import {
        CLEARABLE_TABS,
        PANEL_BODIES,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsExampleProps } from "../TabsPageSvelte.types";

    type Props = TabsExampleProps & { onClear: () => void };

    let props: Props = $props();
</script>

<PageControlColumn>
    <Tabs
        orientation={"horizontal"}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Clearable views"}
        transitionDurationMs={CLEARABLE_TRANSITION_DURATION_MS}
        tabs={CLEARABLE_TABS}
        selectedValue={props.selectedValue}
        onSelectionChange={props.onSelectionChange}
    >
        {#snippet renderGutter()}
            <PageTabGutter orientation={"horizontal"} />
        {/snippet}

        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === props.selectedValue}>
                {tab.value}
            </PageTabContent>
        {/snippet}
    </Tabs>

    {#if props.selectedValue}
        <PageTabPanel id={getPanelId("clearable", props.selectedValue)} tabId={getTabId("clearable", props.selectedValue)}>
            {PANEL_BODIES[props.selectedValue]}
        </PageTabPanel>
    {/if}

    <Button ariaLabel={"Clear the selection"} onClick={async () => props.onClear()}>
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>Clear</PageControlButtonContent>
        {/snippet}
    </Button>
</PageControlColumn>
