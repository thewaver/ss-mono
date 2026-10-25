<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import CustomTabLink from "../CustomTabLink.svelte";
    import type { TabsLinksDocsExampleProps } from "../TabsPageSvelte.types";

    type Props = TabsLinksDocsExampleProps;

    let props: Props = $props();

    let selectedValue = $state("Docs");
</script>

<Tabs
    orientation={"horizontal"}
    tabGap={ROW_TAB_GAP}
    ariaLabel={"Linked destinations"}
    tabs={LINK_TABS}
    {selectedValue}
    onSelectionChange={(value) => {
        selectedValue = value;
    }}
    linkComponent={props.hasLinkComponent ? CustomTabLink : undefined}
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
