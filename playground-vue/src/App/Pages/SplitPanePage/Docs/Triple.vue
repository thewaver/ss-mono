<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_TRIPLE, TRIPLE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const ratios = shallowRef(STARTING_TRIPLE);
</script>

<template>
    <PageSplitPaneFrame>
        <SplitPane v-model:ratios="ratios" :panes="TRIPLE" ariaLabel="Three panes">
            <template #renderPane="{ index }">
                <PageSplitPaneBox>Pane {{ index + 1 }}</PageSplitPaneBox>
            </template>

            <template #renderGutter="flags">
                <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
            </template>
        </SplitPane>
    </PageSplitPaneFrame>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Ratios: ${SplitPanePageUtils.toPercentText(ratios)}` }}
    </div>
</template>
