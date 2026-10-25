<script setup lang="ts">
import { shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import {
    HONEYCOMB_LAYOUT,
    HONEYCOMB_TABS,
    HONEYCOMB_WIDTH,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabCell from "../../../StyledComponents/TabContent/PageTabCell.vue";
import PageTabHexFloater from "../../../StyledComponents/TabContent/PageTabHexFloater.vue";
import PageTabHexHighlightFloater from "../../../StyledComponents/TabContent/PageTabHexHighlightFloater.vue";

const ID_PREFIX = "honeycomb";

const selectedValue = shallowRef("Overview");
</script>

<template>
    <div :class="styles.tabsDemo">
        <div :style="{ width: HONEYCOMB_WIDTH }">
            <Tabs
                ariaLabel="Honeycomb views"
                :tabs="HONEYCOMB_TABS"
                :selected-value="selectedValue"
                :compute-layout="HONEYCOMB_LAYOUT"
                @selection-change="(value: string) => (selectedValue = value)"
            >
                <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                    <PageTabHexFloater
                        orientation="horizontal"
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                    />
                </template>

                <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
                    <PageTabHexHighlightFloater
                        orientation="horizontal"
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                    />
                </template>

                <template #renderTab="{ tab, flags }">
                    <PageTabCell :flags="flags" :is-selected="tab.value === selectedValue">{{ tab.value }}</PageTabCell>
                </template>
            </Tabs>
        </div>

        <PageTabPanel :id="getPanelId(ID_PREFIX, selectedValue)" :tab-id="getTabId(ID_PREFIX, selectedValue)">{{
            PANEL_BODIES[selectedValue]
        }}</PageTabPanel>
    </div>
</template>
