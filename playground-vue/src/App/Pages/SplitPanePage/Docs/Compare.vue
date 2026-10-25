<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { COMPARE, STARTING_COMPARE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import PageSplitPaneCompareBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareBox.vue";
import PageSplitPaneCompareFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const PICTURES = [
    { src: knight_profile, alt: "The knight in an office" },
    { src: knight_date, alt: "The knight at a candlelit table" },
];

const ratios = shallowRef(STARTING_COMPARE);
</script>

<template>
    <PageSplitPaneCompareFrame>
        <SplitPane v-model:ratios="ratios" :panes="COMPARE" ariaLabel="Compare two pictures">
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
