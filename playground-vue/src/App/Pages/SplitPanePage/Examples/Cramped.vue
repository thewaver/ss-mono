<script setup lang="ts">
import { useModel } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

const CRAMPED_WIDTH = 600;

type Props = SplitPaneExampleProps;

const props = defineProps<Props>();

const ratios = useModel(props, "ratios");
</script>

<template>
    <div :style="{ width: `${CRAMPED_WIDTH}px`, overflowX: 'auto' }">
        <PageSplitPaneFrame>
            <SplitPane
                v-model:ratios="ratios"
                :panes="CRAMPED"
                :gutter-size="gutterSize"
                :is-disabled="isDisabled"
                ariaLabel="Cramped panes"
            >
                <template #renderPane="{ index }">
                    <PageSplitPaneBox>{{ index === 0 ? "min 250px" : "min 400px" }}</PageSplitPaneBox>
                </template>

                <template #renderGutter="flags">
                    <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
                </template>
            </SplitPane>
        </PageSplitPaneFrame>
    </div>
</template>
