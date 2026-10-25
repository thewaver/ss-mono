<script setup lang="ts">
import { shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import {
    HOVER_PILL_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";

const ID_PREFIX = "hoverPill";

const selectedValue = shallowRef("Render");
</script>

<template>
    <div :class="styles.tabsDemo">
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Hover pill views"
            :tabs="HOVER_PILL_TABS"
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

            <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
                <PageGlideFloater
                    kind="highlight"
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
