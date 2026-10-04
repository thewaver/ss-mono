<script setup lang="ts">
import { Tabs } from "@thewaver/ss-components-vue";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Tabs
        orientation="horizontal"
        :tab-gap="ROW_TAB_GAP"
        ariaLabel="Linked destinations"
        :tabs="LINK_TABS"
        :selected-value="selectedValue"
        @selection-change="props.onSelectionChange"
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
