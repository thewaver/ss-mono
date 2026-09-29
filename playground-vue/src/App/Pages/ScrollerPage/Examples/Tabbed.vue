<script setup lang="ts">
import { Scroller, Tabs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.vue";
import type { ScrollerTabbedExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;
const TAB_GAP = 10;

type Props = ScrollerTabbedExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.demo">
        <Scroller :gap="SCROLLER_GAP" :padding="FOCUS_RING_WIDTH">
            <template #renderButton="{ step, stepper }">
                <PageScrollerButton :step="step" :stepper="stepper" />
            </template>

            <Tabs
                orientation="horizontal"
                :tab-gap="TAB_GAP"
                ariaLabel="Months"
                :tabs="tabs"
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
                    <PageTabContent
                        :flags="flags"
                        orientation="horizontal"
                        :is-selected="tab.value === selectedValue"
                        >{{ tab.value }}</PageTabContent
                    >
                </template>
            </Tabs>
        </Scroller>
    </div>
</template>
