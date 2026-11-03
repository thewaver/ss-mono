<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Accordion, Tabs } from "@thewaver/ss-components-vue";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import {
    LOOK_SAMPLE_EXPANDED_SECTIONS,
    LOOK_SAMPLE_SECTIONS,
    LOOK_SAMPLE_SECTION_BODY,
    LOOK_SAMPLE_SELECTED_TAB,
    LOOK_SAMPLE_TABS,
    LOOK_SAMPLE_TAB_PANEL,
} from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";
import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageTabPanel from "../../PageComponents/TabPanel/TabPanel.vue";
import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.vue";
import LookButtonSample from "./LookButtonSample.vue";
import LookCheckboxSample from "./LookCheckboxSample.vue";
import LookInputSample from "./LookInputSample.vue";
import LookProgressSample from "./LookProgressSample.vue";
import LookRadioSample from "./LookRadioSample.vue";
import LookRangeSample from "./LookRangeSample.vue";
import LookSampleColumn from "./LookSampleColumn.vue";
import LookSlideSample from "./LookSlideSample.vue";
import LookTagSample from "./LookTagSample.vue";
import LookToggleSample from "./LookToggleSample.vue";
import type { LookSamplesProps } from "./LooksPage.types";

const props = defineProps<LookSamplesProps>();

const expanded = shallowRef(LOOK_SAMPLE_EXPANDED_SECTIONS);

const idPrefix = computed(() => `look-${props.look}`);

const tabs = computed(() =>
    LOOK_SAMPLE_TABS.map((tab) => ({
        ...tab,
        id: getTabId(idPrefix.value, tab.value),
        panelId: getPanelId(idPrefix.value, tab.value),
    })),
);
</script>

<template>
    <LookSampleColumn name="Surface">
        <div :class="styles.lookPanel">A panel inside a surface.</div>
    </LookSampleColumn>

    <LookSampleColumn name="Tabs">
        <div :class="styles.lookWideSample">
            <Tabs :tab-gap="ROW_TAB_GAP" ariaLabel="Tabs" :tabs="tabs" :selected-value="LOOK_SAMPLE_SELECTED_TAB">
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
                        :is-selected="tab.value === LOOK_SAMPLE_SELECTED_TAB"
                        >{{ tab.value }}</PageTabContent
                    >
                </template>
            </Tabs>

            <PageTabPanel
                :id="getPanelId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)"
                :tab-id="getTabId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)"
                >{{ LOOK_SAMPLE_TAB_PANEL }}</PageTabPanel
            >
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Input" is-wide>
        <div :class="[styles.lookStateGrid, styles.lookFittedStateGrid]">
            <LookInputSample state="Default" />
            <LookInputSample state="Read-only" is-read-only />
            <LookInputSample state="Disabled" is-disabled />
            <LookInputSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Tags" is-wide>
        <div :class="[styles.lookStateGrid, styles.lookFittedStateGrid]">
            <LookTagSample state="Default" />
            <LookTagSample state="Disabled" is-disabled />
            <LookTagSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Button">
        <div :class="styles.lookStateGrid">
            <LookButtonSample state="Default" />
            <LookButtonSample state="Pressed" is-pressed />
            <LookButtonSample state="Disabled" is-disabled />
            <LookButtonSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Toggle">
        <div :class="styles.lookStateGrid">
            <LookToggleSample state="Off" />
            <LookToggleSample state="On" is-checked />
            <LookToggleSample state="Disabled" is-disabled />
            <LookToggleSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Checkbox">
        <div :class="styles.lookStateGrid">
            <LookCheckboxSample state="Off" />
            <LookCheckboxSample state="On" is-checked />
            <LookCheckboxSample state="Mixed" is-mixed />
            <LookCheckboxSample state="Disabled" is-disabled />
            <LookCheckboxSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Radio">
        <div :class="styles.lookStateGrid">
            <LookRadioSample state="Off" />
            <LookRadioSample state="On" is-checked />
            <LookRadioSample state="Disabled" is-disabled />
            <LookRadioSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Progress">
        <div :class="styles.lookBarStack">
            <LookProgressSample state="Default" />
            <LookProgressSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Range">
        <div :class="styles.lookBarStack">
            <LookRangeSample state="Default" />
            <LookRangeSample state="Disabled" is-disabled />
            <LookRangeSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Slide button">
        <div :class="styles.lookBarStack">
            <LookSlideSample state="Default" />
            <LookSlideSample state="Disabled" is-disabled />
            <LookSlideSample state="Error" has-error />
        </div>
    </LookSampleColumn>

    <LookSampleColumn name="Accordion">
        <div :class="styles.lookWideSample">
            <Accordion v-model:expanded="expanded" :items="LOOK_SAMPLE_SECTIONS" :gap="DOCS_GAP">
                <template #renderHeader="{ item, flags }">
                    <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
                </template>

                <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                    <PageAccordionPanel
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                        >{{ LOOK_SAMPLE_SECTION_BODY }}</PageAccordionPanel
                    >
                </template>
            </Accordion>
        </div>
    </LookSampleColumn>
</template>
