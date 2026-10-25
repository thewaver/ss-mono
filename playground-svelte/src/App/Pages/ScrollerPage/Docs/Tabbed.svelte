<script lang="ts">
    import { Scroller, Tabs } from "@thewaver/ss-components-svelte";
    import type { ScrollerController, Tab } from "@thewaver/ss-components-svelte";
    import {
        MONTHS,
        getMonthPanelId,
        getMonthTabId,
    } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";

    const TAB_GAP = 10;

    const MONTH_TABS: Tab<string>[] = MONTHS.map((month) => ({
        value: month,
        id: getMonthTabId(month),
        panelId: getMonthPanelId(month),
    }));

    let controller = $state<ScrollerController>();
    let selectedMonth = $state(MONTHS[0]);
</script>

<div class={styles.tabbedDemo}>
    <div class={styles.tabbedStripLayout}>
        <PageScrollerButton id={"tabbedBack"} {controller} step={"previous"} />

        <div class={styles.scrollerCell}>
            <Scroller
                padding={FOCUS_RING_WIDTH}
                onMount={(next) => {
                    controller = next;
                }}
            >
                <Tabs
                    orientation={"horizontal"}
                    tabGap={TAB_GAP}
                    ariaLabel={"Months"}
                    tabs={MONTH_TABS}
                    selectedValue={selectedMonth}
                    onSelectionChange={(month) => {
                        selectedMonth = month;
                    }}
                >
                    {#snippet renderGutter()}
                        <PageTabGutter orientation={"horizontal"} />
                    {/snippet}

                    {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                        <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
                    {/snippet}

                    {#snippet renderTab(tab, flags)}
                        <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === selectedMonth}>
                            {tab.value}
                        </PageTabContent>
                    {/snippet}
                </Tabs>
            </Scroller>
        </div>

        <PageScrollerButton id={"tabbedForward"} {controller} step={"next"} />
    </div>

    <PageTabPanel id={getMonthPanelId(selectedMonth)} tabId={getMonthTabId(selectedMonth)}>
        {selectedMonth}
    </PageTabPanel>
</div>
