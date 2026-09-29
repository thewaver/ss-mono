<script setup lang="ts">
import { useModel } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

const props = defineProps<Props>();

const ratios = useModel(props, "ratios");
</script>

<template>
    <PageSplitPaneFrame>
        <SplitPane
            v-model:ratios="ratios"
            :panes="PAIR"
            orientation="vertical"
            :gutter-size="gutterSize"
            :is-disabled="isDisabled"
            ariaLabel="Stacked panes"
        >
            <template #renderPane="{ index }">
                <PageSplitPaneBox>{{ index === 0 ? "Top" : "Bottom" }}</PageSplitPaneBox>
            </template>

            <template #renderGutter="flags">
                <PageSplitPaneGutter :flags="flags" orientation="vertical" />
            </template>
        </SplitPane>
    </PageSplitPaneFrame>
</template>
