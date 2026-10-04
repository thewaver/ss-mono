<script setup lang="ts">
import { Tabs } from "@thewaver/ss-components-vue";
import {
    COLUMN_TABS,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.columnDemo">
        <Tabs
            orientation="vertical"
            ariaLabel="Example sections"
            :tabs="COLUMN_TABS"
            :selected-value="selectedValue"
            @selection-change="props.onSelectionChange"
        >
            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageTabFloater
                    orientation="vertical"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <template #renderTab="{ tab, flags }">
                <PageTabContent :flags="flags" orientation="vertical" :is-selected="tab.value === selectedValue">{{
                    tab.value
                }}</PageTabContent>
            </template>
        </Tabs>

        <div :class="styles.columnDemoPanel">
            <PageTabPanel
                :id="getPanelId('column', selectedValue ?? '')"
                :tab-id="getTabId('column', selectedValue ?? '')"
                >{{ PANEL_BODIES[selectedValue ?? ""] }}</PageTabPanel
            >
        </div>
    </div>
</template>
