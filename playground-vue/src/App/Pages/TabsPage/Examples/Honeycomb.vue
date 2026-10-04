<script setup lang="ts">
import { PlacementLayoutUtils, Tabs } from "@thewaver/ss-components-vue";
import type { HoneycombDefs } from "@thewaver/ss-components-vue";
import {
    HONEYCOMB_TABS,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.vue";
import PageTabCell from "../../../StyledComponents/TabContent/PageTabCell.vue";
import PageTabHexFloater from "../../../StyledComponents/TabContent/PageTabHexFloater.vue";
import PageTabHexHighlightFloater from "../../../StyledComponents/TabContent/PageTabHexHighlightFloater.vue";
import type { TabsExampleProps } from "../TabsPage.types";

const HONEYCOMB_DEFS: HoneycombDefs = { perRow: 3, gapRatio: 0 };

const HONEYCOMB_LAYOUT = PlacementLayoutUtils.createHoneycomb(HONEYCOMB_DEFS);

const HONEYCOMB_WIDTH = "294px";

const ID_PREFIX = "honeycomb";

type Props = TabsExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.rowDemo">
        <div :style="{ width: HONEYCOMB_WIDTH }">
            <Tabs
                ariaLabel="Honeycomb views"
                :tabs="HONEYCOMB_TABS"
                :selected-value="selectedValue"
                :compute-layout="HONEYCOMB_LAYOUT"
                @selection-change="props.onSelectionChange"
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

        <PageTabPanel
            :id="getPanelId(ID_PREFIX, selectedValue ?? '')"
            :tab-id="getTabId(ID_PREFIX, selectedValue ?? '')"
            >{{ PANEL_BODIES[selectedValue ?? ""] }}</PageTabPanel
        >
    </div>
</template>
