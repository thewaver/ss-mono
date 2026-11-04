<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Accordion, Tabs } from "@thewaver/ss-components-vue";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import {
    SKIN_SAMPLE_EXPANDED_SECTIONS,
    SKIN_SAMPLE_SECTIONS,
    SKIN_SAMPLE_SECTION_BODY,
    SKIN_SAMPLE_SELECTED_TAB,
    SKIN_SAMPLE_TABS,
    SKIN_SAMPLE_TAB_PANEL,
} from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";
import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageTabPanel from "../../PageComponents/TabPanel/TabPanel.vue";
import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.vue";
import SkinButtonSample from "./SkinButtonSample.vue";
import SkinCheckboxSample from "./SkinCheckboxSample.vue";
import SkinInputSample from "./SkinInputSample.vue";
import SkinProgressSample from "./SkinProgressSample.vue";
import SkinRadioSample from "./SkinRadioSample.vue";
import SkinRangeSample from "./SkinRangeSample.vue";
import SkinSampleColumn from "./SkinSampleColumn.vue";
import SkinSimpleButtonSample from "./SkinSimpleButtonSample.vue";
import SkinSlideSample from "./SkinSlideSample.vue";
import SkinTagSample from "./SkinTagSample.vue";
import SkinToggleSample from "./SkinToggleSample.vue";
import type { SkinSamplesProps } from "./SkinsPage.types";

const props = defineProps<SkinSamplesProps>();

const expanded = shallowRef(SKIN_SAMPLE_EXPANDED_SECTIONS);

const idPrefix = computed(() => `skin-${props.skin}`);

const tabs = computed(() =>
    SKIN_SAMPLE_TABS.map((tab) => ({
        ...tab,
        id: getTabId(idPrefix.value, tab.value),
        panelId: getPanelId(idPrefix.value, tab.value),
    })),
);
</script>

<template>
    <SkinSampleColumn name="Surface">
        <div :class="styles.skinPanel">A panel inside a surface.</div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Tabs">
        <div :class="styles.skinWideSample">
            <Tabs :tab-gap="ROW_TAB_GAP" ariaLabel="Tabs" :tabs="tabs" :selected-value="SKIN_SAMPLE_SELECTED_TAB">
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
                        :is-selected="tab.value === SKIN_SAMPLE_SELECTED_TAB"
                        >{{ tab.value }}</PageTabContent
                    >
                </template>
            </Tabs>

            <PageTabPanel
                :id="getPanelId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)"
                :tab-id="getTabId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)"
                >{{ SKIN_SAMPLE_TAB_PANEL }}</PageTabPanel
            >
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Input" is-wide>
        <div :class="[styles.skinStateGrid, styles.skinFittedStateGrid]">
            <SkinInputSample state="Default" />
            <SkinInputSample state="Read-only" is-read-only />
            <SkinInputSample state="Disabled" is-disabled />
            <SkinInputSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Tags" is-wide>
        <div :class="[styles.skinStateGrid, styles.skinFittedStateGrid]">
            <SkinTagSample state="Default" />
            <SkinTagSample state="Disabled" is-disabled />
            <SkinTagSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Button">
        <div :class="styles.skinStateGrid">
            <SkinButtonSample state="Default" />
            <SkinButtonSample state="Pressed" is-pressed />
            <SkinButtonSample state="Disabled" is-disabled />
            <SkinButtonSample state="Error" has-error />
            <SkinButtonSample state="Pressed Error" is-pressed has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Simple button">
        <div :class="styles.skinStateGrid">
            <SkinSimpleButtonSample state="Default" />
            <SkinSimpleButtonSample state="Pressed" is-pressed />
            <SkinSimpleButtonSample state="Disabled" is-disabled />
            <SkinSimpleButtonSample state="Error" has-error />
            <SkinSimpleButtonSample state="Pressed Error" is-pressed has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Toggle">
        <div :class="styles.skinStateGrid">
            <SkinToggleSample state="Off" />
            <SkinToggleSample state="On" is-checked />
            <SkinToggleSample state="Disabled" is-disabled />
            <SkinToggleSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Checkbox">
        <div :class="styles.skinStateGrid">
            <SkinCheckboxSample state="Off" />
            <SkinCheckboxSample state="On" is-checked />
            <SkinCheckboxSample state="Mixed" is-mixed />
            <SkinCheckboxSample state="Disabled" is-disabled />
            <SkinCheckboxSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Radio">
        <div :class="styles.skinStateGrid">
            <SkinRadioSample state="Off" />
            <SkinRadioSample state="On" is-checked />
            <SkinRadioSample state="Disabled" is-disabled />
            <SkinRadioSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Progress">
        <div :class="styles.skinBarStack">
            <SkinProgressSample state="Default" />
            <SkinProgressSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Range">
        <div :class="styles.skinBarStack">
            <SkinRangeSample state="Default" />
            <SkinRangeSample state="Disabled" is-disabled />
            <SkinRangeSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Slide button">
        <div :class="styles.skinBarStack">
            <SkinSlideSample state="Default" />
            <SkinSlideSample state="Disabled" is-disabled />
            <SkinSlideSample state="Error" has-error />
        </div>
    </SkinSampleColumn>

    <SkinSampleColumn name="Accordion">
        <div :class="styles.skinWideSample">
            <Accordion v-model:expanded="expanded" :items="SKIN_SAMPLE_SECTIONS" :gap="DOCS_GAP">
                <template #renderHeader="{ item, flags }">
                    <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
                </template>

                <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                    <PageAccordionPanel
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                        >{{ SKIN_SAMPLE_SECTION_BODY }}</PageAccordionPanel
                    >
                </template>
            </Accordion>
        </div>
    </SkinSampleColumn>
</template>
