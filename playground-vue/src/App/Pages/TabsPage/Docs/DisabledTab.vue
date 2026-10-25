<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import type { Tab } from "@thewaver/ss-components-vue";
import {
    PANEL_BODIES,
    REACHABLE_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsDisabledTabDocsExampleProps } from "../TabsPageVue.types";

const ID_PREFIX = "reachable";

type Props = TabsDisabledTabDocsExampleProps;

const props = defineProps<Props>();

const selectedValue = shallowRef("Render");

const tabs = computed<Tab<string>[]>(() =>
    REACHABLE_TABS.map((tab) =>
        tab.isDisabled ? { ...tab, isReachableWhenDisabled: props.isReachableWhenDisabled } : tab,
    ),
);
</script>

<template>
    <div :class="styles.tabsDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Partly disabled views"
            :tabs="tabs"
            :selected-value="selectedValue"
            @selection-change="(value: string) => (selectedValue = value)"
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
                <PageTabContent :flags="flags" orientation="horizontal" :is-selected="tab.value === selectedValue">{{
                    tab.value
                }}</PageTabContent>
            </template>
        </Tabs>

        <PageTabPanel :id="getPanelId(ID_PREFIX, selectedValue)" :tab-id="getTabId(ID_PREFIX, selectedValue)">{{
            PANEL_BODIES[selectedValue]
        }}</PageTabPanel>
    </div>
</template>
