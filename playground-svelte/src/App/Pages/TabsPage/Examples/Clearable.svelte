<script lang="ts" module>
    export const CLEARABLE_TRANSITION_DURATION_MS = 600;
</script>

<script lang="ts">
    import { Button, Tabs } from "@thewaver/ss-components-svelte";
    import { CLEARABLE_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";

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

        {#snippet renderFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === props.selectedValue}>
                {tab.value}
            </PageTabContent>
        {/snippet}
    </Tabs>

    <Button ariaLabel={"Clear the selection"} onClick={async () => props.onClear()}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Clear</PageButtonContent>
        {/snippet}
    </Button>
</PageControlColumn>
