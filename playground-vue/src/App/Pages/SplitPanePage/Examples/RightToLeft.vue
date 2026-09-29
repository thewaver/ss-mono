<script setup lang="ts">
import { useModel } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { RIGHT_TO_LEFT } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

const props = defineProps<Props>();

const ratios = useModel(props, "ratios");
</script>

<template>
    <div dir="rtl">
        <PageSplitPaneFrame>
            <SplitPane
                v-model:ratios="ratios"
                :panes="RIGHT_TO_LEFT"
                :gutter-size="gutterSize"
                :is-disabled="isDisabled"
                ariaLabel="Two panes in a right-to-left box"
            >
                <template #renderPane="{ index }">
                    <PageSplitPaneBox>{{ index === 0 ? "Navigation" : "Content" }}</PageSplitPaneBox>
                </template>

                <template #renderGutter="flags">
                    <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
                </template>
            </SplitPane>
        </PageSplitPaneFrame>
    </div>
</template>
