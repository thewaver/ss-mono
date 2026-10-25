<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Tabs } from "@thewaver/ss-components-vue";
import {
    CLEARABLE_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";

const ID_PREFIX = "clearable";

const TRANSITION_DURATION_MS = 600;

const selectedValue = shallowRef<string | undefined>("One");
</script>

<template>
    <div :class="styles.tabsDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Clearable views"
            :transition-duration-ms="TRANSITION_DURATION_MS"
            :tabs="CLEARABLE_TABS"
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

        <PageTabPanel
            v-if="selectedValue !== undefined"
            :id="getPanelId(ID_PREFIX, selectedValue)"
            :tab-id="getTabId(ID_PREFIX, selectedValue)"
            >{{ PANEL_BODIES[selectedValue] }}</PageTabPanel
        >

        <Button id="clearSelection" ariaLabel="Clear the selection" @click="selectedValue = undefined">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Clear</PageControlButtonContent>
            </template>
        </Button>
    </div>
</template>
