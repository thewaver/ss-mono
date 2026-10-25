<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PAIR, STARTING_PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";
import type { SplitPaneBasicDocsExampleProps } from "../SplitPanePageVue.types";

type Props = SplitPaneBasicDocsExampleProps;

defineProps<Props>();

const ratios = shallowRef(STARTING_PAIR);
</script>

<template>
    <PageSplitPaneFrame>
        <SplitPane
            v-model:ratios="ratios"
            :panes="PAIR"
            :orientation="orientation"
            :gutter-size="gutterSize"
            :is-disabled="isDisabled"
            ariaLabel="Two panes"
        >
            <template #renderPane="{ index }">
                <PageSplitPaneBox>{{ index === 0 ? "Navigation" : "Content" }}</PageSplitPaneBox>
            </template>

            <template #renderGutter="flags">
                <PageSplitPaneGutter :flags="flags" :orientation="orientation" />
            </template>
        </SplitPane>
    </PageSplitPaneFrame>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Ratios: ${SplitPanePageUtils.toPercentText(ratios)}` }}
    </div>
</template>
