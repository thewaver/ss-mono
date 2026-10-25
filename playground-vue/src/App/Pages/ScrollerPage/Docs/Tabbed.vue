<script setup lang="ts">
import { shallowRef } from "vue";

import { Scroller, Tabs } from "@thewaver/ss-components-vue";
import type { ScrollerController, Tab } from "@thewaver/ss-components-vue";
import {
    MONTHS,
    getMonthPanelId,
    getMonthTabId,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";

const TAB_GAP = 10;

const MONTH_TABS: Tab<string>[] = MONTHS.map((month) => ({
    value: month,
    id: getMonthTabId(month),
    panelId: getMonthPanelId(month),
}));

const controller = shallowRef<ScrollerController>();
const selectedMonth = shallowRef(MONTHS[0]);
</script>

<template>
    <div :class="styles.tabbedDemo">
        <div :class="styles.tabbedStripLayout">
            <PageScrollerButton id="tabbedBack" :controller="controller" step="previous" />

            <div :class="styles.scrollerCell">
                <Scroller :padding="FOCUS_RING_WIDTH" @mount="(next: ScrollerController) => (controller = next)">
                    <Tabs
                        orientation="horizontal"
                        :tab-gap="TAB_GAP"
                        ariaLabel="Months"
                        :tabs="MONTH_TABS"
                        :selected-value="selectedMonth"
                        @selection-change="(value: string) => (selectedMonth = value)"
                    >
                        <template #renderGutter>
                            <PageTabGutter orientation="horizontal" />
                        </template>

                        <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                            <PageTabFloater
                                orientation="horizontal"
                                :visibility-target="visibilityTarget"
                                :transition-duration-ms="transitionDurationMs"
                            />
                        </template>

                        <template #renderTab="{ tab, flags }">
                            <PageTabContent
                                :flags="flags"
                                orientation="horizontal"
                                :is-selected="tab.value === selectedMonth"
                                >{{ tab.value }}</PageTabContent
                            >
                        </template>
                    </Tabs>
                </Scroller>
            </div>

            <PageScrollerButton id="tabbedForward" :controller="controller" step="next" />
        </div>

        <PageTabPanel :id="getMonthPanelId(selectedMonth)" :tab-id="getMonthTabId(selectedMonth)">{{
            selectedMonth
        }}</PageTabPanel>
    </div>
</template>
