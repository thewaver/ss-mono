<script setup lang="ts">
import { computed } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import type { Tab } from "@thewaver/ss-components-vue";
import {
    PANEL_BODIES,
    ROW_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsExampleProps } from "../TabsPage.types";

const DEFAULT_ID_PREFIX = "row";

type Props = TabsExampleProps & {
    tabs?: Tab<string>[];
    idPrefix?: string;
};

const props = defineProps<Props>();

const idPrefix = computed(() => props.idPrefix ?? DEFAULT_ID_PREFIX);
</script>

<template>
    <div :class="styles.rowDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Example views"
            :has-auto-activation="hasAutoActivation"
            :tabs="tabs ?? ROW_TABS"
            :selected-value="selectedValue"
            @selection-change="props.onSelectionChange"
        >
            <template #renderGutter>
                <PageTabGutter orientation="horizontal" />
            </template>

            <template #renderFloater="{ visibilityTarget, transitionDurationMs }">
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
            :id="getPanelId(idPrefix, selectedValue ?? '')"
            :tab-id="getTabId(idPrefix, selectedValue ?? '')"
            >{{ PANEL_BODIES[selectedValue ?? ""] }}</PageTabPanel
        >
    </div>
</template>
