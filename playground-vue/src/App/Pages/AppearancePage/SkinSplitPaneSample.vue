<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { SKIN_SAMPLE_SPLIT } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneBox from "../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const ratios = shallowRef(SKIN_SAMPLE_SPLIT);
</script>

<template>
    <PageSplitPaneFrame>
        <SplitPane v-model:ratios="ratios" :panes="PAIR" orientation="horizontal" ariaLabel="Split pane">
            <template #renderPane="{ index }">
                <PageSplitPaneBox>{{ index === 0 ? "Navigation" : "Content" }}</PageSplitPaneBox>
            </template>

            <template #renderGutter="flags">
                <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
            </template>
        </SplitPane>
    </PageSplitPaneFrame>
</template>
