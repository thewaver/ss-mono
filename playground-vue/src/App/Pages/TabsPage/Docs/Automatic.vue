<script setup lang="ts">
import { shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import {
    AUTOMATIC_TABS,
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
import type { TabsAutomaticDocsExampleProps } from "../TabsPageVue.types";

const ID_PREFIX = "automatic";

type Props = TabsAutomaticDocsExampleProps;

defineProps<Props>();

const selectedValue = shallowRef("Render");
</script>

<template>
    <div :class="styles.tabsDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Automatic views"
            :has-auto-activation="hasAutoActivation"
            :tabs="AUTOMATIC_TABS"
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
