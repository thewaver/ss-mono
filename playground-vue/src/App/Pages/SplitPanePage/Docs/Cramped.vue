<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { CRAMPED, STARTING_CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const CRAMPED_WIDTH = 600;

const ratios = shallowRef(STARTING_CRAMPED);
</script>

<template>
    <div :style="{ width: `${CRAMPED_WIDTH}px`, maxWidth: '100%', overflowX: 'auto' }">
        <PageSplitPaneFrame>
            <SplitPane v-model:ratios="ratios" :panes="CRAMPED" ariaLabel="Cramped panes">
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
