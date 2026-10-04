<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import { DISABLED_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";

    type Props = TabsExampleProps;

    let props: Props = $props();
</script>

<Tabs
    orientation={"horizontal"}
    tabGap={ROW_TAB_GAP}
    ariaLabel={"Unavailable views"}
    tabs={DISABLED_TABS}
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
