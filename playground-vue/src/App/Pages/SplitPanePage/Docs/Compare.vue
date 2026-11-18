<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import {
    COMPARE,
    COMPARE_TWO_PICTURES_LABEL,
    PICTURES,
    STARTING_COMPARE,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneCompareBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareBox.vue";
import PageSplitPaneCompareFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const ratios = shallowRef(STARTING_COMPARE);
</script>

<template>
    <PageSplitPaneCompareFrame>
        <SplitPane v-model:ratios="ratios" :panes="COMPARE" :ariaLabel="COMPARE_TWO_PICTURES_LABEL">
            <template #renderPane="{ index }">
                <PageSplitPaneCompareBox
                    :side="index === 0 ? 'start' : 'end'"
                    :src="PICTURES[index].src"
                    :alt="PICTURES[index].alt"
                />
            </template>

            <template #renderGutter="flags">
                <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
            </template>
        </SplitPane>
    </PageSplitPaneCompareFrame>
</template>
