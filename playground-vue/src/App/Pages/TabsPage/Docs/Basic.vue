<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import type { Tab } from "@thewaver/ss-components-vue";
import {
    BASIC_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsBasicDocsExampleProps } from "../TabsPageVue.types";

const ID_PREFIX = "basic";

type Props = TabsBasicDocsExampleProps;

const props = defineProps<Props>();

const selectedValue = shallowRef("Render");

const tabs = computed<Tab<string>[]>(() => BASIC_TABS.map((tab) => ({ ...tab, isDisabled: props.isDisabled })));
</script>

<template>
    <div :class="styles.tabsDemo" :data-orientation="orientation">
        <Tabs
            :orientation="orientation"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Example views"
            :tabs="tabs"
            :selected-value="selectedValue"
            @selection-change="(value: string) => (selectedValue = value)"
        >
            <template #renderGutter>
                <PageTabGutter :orientation="orientation" />
            </template>

            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageTabFloater
                    :orientation="orientation"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <template #renderTab="{ tab, flags }">
                <PageTabContent :flags="flags" :orientation="orientation" :is-selected="tab.value === selectedValue">{{
                    tab.value
                }}</PageTabContent>
            </template>
        </Tabs>

        <div :class="styles.tabsDemoPanel">
            <PageTabPanel :id="getPanelId(ID_PREFIX, selectedValue)" :tab-id="getTabId(ID_PREFIX, selectedValue)">{{
                PANEL_BODIES[selectedValue]
            }}</PageTabPanel>
        </div>
    </div>
</template>
