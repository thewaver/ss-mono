<script setup lang="ts">
import { shallowRef } from "vue";

import { Tabs } from "@thewaver/ss-components-vue";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsLinksDocsExampleProps } from "../TabsPageVue.types";
import CustomTabLink from "./CustomTabLink.vue";

type Props = TabsLinksDocsExampleProps;

defineProps<Props>();

const selectedValue = shallowRef("Docs");
</script>

<template>
    <Tabs
        orientation="horizontal"
        :tab-gap="ROW_TAB_GAP"
        ariaLabel="Linked destinations"
        :tabs="LINK_TABS"
        :selected-value="selectedValue"
        :link-component="hasLinkComponent ? CustomTabLink : undefined"
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
</template>
