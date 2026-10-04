<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Accordion, Scroller, Tabs, useViewportContext } from "@thewaver/ss-components-vue";
import type { AccordionItem, Tab } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/SourceView/SourceView.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.vue";
import PageCodeBox from "../CodeBox/CodeBox.vue";
import PageScrollerButton from "../ScrollerButton/ScrollerButton.vue";
import PageTabPanel from "../TabPanel/TabPanel.vue";
import type { SourceGroup, SourceViewProps } from "./SourceView.types";
import { SourceViewUtils } from "./SourceView.utils";

const TAB_GAP = 10;
const SECTION_GAP = 5;
const MODAL_MARGIN_HEIGHT = 80;

const getTabId = (name: string) => `source-tab-${name}`;

const getPanelId = (name: string) => `source-panel-${name}`;

const props = defineProps<SourceViewProps>();

const viewportContext = useViewportContext();

let loadToken = 0;

const groups = shallowRef<SourceGroup[]>([]);
const selectedGroup = shallowRef<SourceGroup>();
const expandedNames = shallowRef<string[]>([]);

const selectGroup = (group: SourceGroup | undefined) => {
    selectedGroup.value = group;
    expandedNames.value = group?.expandedNames ?? [];
};

const tabs = computed((): Tab<SourceGroup>[] =>
    groups.value.map((group) => ({
        value: group,
        id: getTabId(group.name),
        panelId: getPanelId(group.name),
    })),
);

const items = computed((): AccordionItem<string>[] =>
    (selectedGroup.value?.files ?? []).map((file) => ({ value: file.name })),
);

const getSource = (name: string) => selectedGroup.value?.files.find((file) => file.name === name)?.source ?? "";

watch(
    () => props.path,
    (path) => {
        const token = ++loadToken;

        void SourceViewUtils.loadGroups(path).then((loaded) => {
            if (token !== loadToken) return;

            groups.value = loaded;
            selectGroup(loaded[0]);
        });
    },
    { immediate: true },
);
</script>

<template>
    <div
        v-if="selectedGroup"
        :class="styles.sourceViewRoot"
        :style="{ maxHeight: `${viewportContext.getSize().height - MODAL_MARGIN_HEIGHT}px` }"
    >
        <div :class="styles.sourceViewTabs">
            <Scroller :gap="TAB_GAP" :padding="FOCUS_RING_WIDTH">
                <template #renderButton="{ step, stepper }">
                    <PageScrollerButton :step="step" :stepper="stepper" />
                </template>

                <Tabs
                    orientation="horizontal"
                    :tab-gap="TAB_GAP"
                    ariaLabel="Source files"
                    :tabs="tabs"
                    :selected-value="selectedGroup"
                    @selection-change="selectGroup"
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
                            :is-selected="tab.value === selectedGroup"
                            >{{ tab.value.name }}</PageTabContent
                        >
                    </template>
                </Tabs>
            </Scroller>
        </div>

        <div :class="styles.sourceViewPanel">
            <PageTabPanel :id="getPanelId(selectedGroup.name)" :tab-id="getTabId(selectedGroup.name)">
                <Accordion v-model:expanded="expandedNames" :items="items" :gap="SECTION_GAP">
                    <template #renderHeader="{ item, flags }">
                        <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
                    </template>

                    <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
                        <PageAccordionPanel
                            :visibility-target="visibilityTarget"
                            :transition-duration-ms="transitionDurationMs"
                        >
                            <PageCodeBox :source="getSource(item.value)" />
                        </PageAccordionPanel>
                    </template>
                </Accordion>
            </PageTabPanel>
        </div>
    </div>
</template>
