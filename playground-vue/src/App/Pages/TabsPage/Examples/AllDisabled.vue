<script setup lang="ts">
import { Tabs } from "@thewaver/ss-components-vue";
import {
    DISABLED_TABS,
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
import type { TabsExampleProps } from "../TabsPageVue.types";

type Props = TabsExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.rowDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Unavailable views"
            :tabs="DISABLED_TABS"
            :selected-value="selectedValue"
            @selection-change="props.onSelectionChange"
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

        <PageTabPanel
            :id="getPanelId('disabled', selectedValue ?? '')"
            :tab-id="getTabId('disabled', selectedValue ?? '')"
            >{{ PANEL_BODIES[selectedValue ?? ""] }}</PageTabPanel
        >
    </div>
</template>
