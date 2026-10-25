<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Tabs } from "@thewaver/ss-components-vue";
import {
    PANEL_BODIES,
    RIGHT_TO_LEFT_TABS,
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

const ID_PREFIX = "rtl";

const selectedValue = shallowRef("Render");
const isRightToLeft = shallowRef(true);

const switchDirection = () => {
    isRightToLeft.value = !isRightToLeft.value;
};
</script>

<template>
    <div :class="styles.tabsDemo">
        <div :class="styles.tabsDemo" :dir="isRightToLeft ? 'rtl' : 'ltr'">
            <Tabs
                orientation="horizontal"
                :tab-gap="ROW_TAB_GAP"
                ariaLabel="Right-to-left views"
                :tabs="RIGHT_TO_LEFT_TABS"
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
                    <PageTabContent
                        :flags="flags"
                        orientation="horizontal"
                        :is-selected="tab.value === selectedValue"
                        >{{ tab.value }}</PageTabContent
                    >
                </template>
            </Tabs>

            <PageTabPanel :id="getPanelId(ID_PREFIX, selectedValue)" :tab-id="getTabId(ID_PREFIX, selectedValue)">{{
                PANEL_BODIES[selectedValue]
            }}</PageTabPanel>
        </div>

        <Button id="switchDirection" ariaLabel="Switch the direction" @click="switchDirection">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Switch the direction</PageControlButtonContent>
            </template>
        </Button>
    </div>
</template>
