<script lang="ts">
export const CLEARABLE_TRANSITION_DURATION_MS = 600;
</script>

<script setup lang="ts">
import { Button, Tabs } from "@thewaver/ss-components-vue";
import { CLEARABLE_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps & { onClear: () => void };

const props = defineProps<Props>();
</script>

<template>
    <PageControlColumn>
        <Tabs
            orientation="horizontal"
            :tab-gap="ROW_TAB_GAP"
            ariaLabel="Clearable views"
            :transition-duration-ms="CLEARABLE_TRANSITION_DURATION_MS"
            :tabs="CLEARABLE_TABS"
            :selected-value="selectedValue"
            @selection-change="props.onSelectionChange"
        >
            <template #renderGutter>
                <PageTabGutter orientation="horizontal" />
            </template>

            <template #renderFloater="{ visibilityTarget, transitionDurationMs }">
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

        <Button ariaLabel="Clear the selection" @click="async () => props.onClear()">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Clear</PageButtonContent>
            </template>
        </Button>
    </PageControlColumn>
</template>
