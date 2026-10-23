<script lang="ts">
    import { Scroller, Tabs } from "@thewaver/ss-components-svelte";
    import { getMonthPanelId, getMonthTabId } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { ScrollerTabbedExampleProps } from "../ScrollerPageSvelte.types";

    const SCROLLER_GAP = 10;
    const TAB_GAP = 10;

    type Props = ScrollerTabbedExampleProps;

    let props: Props = $props();
</script>

<div class={styles.tabbedDemo}>
    <Scroller gap={SCROLLER_GAP} padding={FOCUS_RING_WIDTH}>
        {#snippet renderButton(step, stepper)}
            <PageScrollerButton {step} {stepper} />
        {/snippet}

        <Tabs
            orientation={"horizontal"}
            tabGap={TAB_GAP}
            ariaLabel={"Months"}
            tabs={props.tabs}
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
    </Scroller>

    <PageTabPanel id={getMonthPanelId(props.selectedValue)} tabId={getMonthTabId(props.selectedValue)}>
        {props.selectedValue}
    </PageTabPanel>
</div>
