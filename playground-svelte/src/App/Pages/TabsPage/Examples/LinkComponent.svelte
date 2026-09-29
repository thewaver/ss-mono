<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";
    import PageTabLink from "./PageTabLink.svelte";

    type Props = TabsExampleProps;

    let props: Props = $props();
</script>

<Tabs
    orientation={"horizontal"}
    tabGap={ROW_TAB_GAP}
    ariaLabel={"Routed destinations"}
    tabs={LINK_TABS}
    selectedValue={props.selectedValue}
    onSelectionChange={props.onSelectionChange}
    linkComponent={PageTabLink}
>
    {#snippet renderGutter()}
        <PageTabGutter orientation={"horizontal"} />
    {/snippet}

    {#snippet renderFloater(visibilityTarget, transitionDurationMs)}
        <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderTab(tab, flags)}
        <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === props.selectedValue}>
            {tab.value}
        </PageTabContent>
    {/snippet}
</Tabs>
