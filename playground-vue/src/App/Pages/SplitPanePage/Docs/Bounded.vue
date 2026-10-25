<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { BOUNDED, STARTING_BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const ratios = shallowRef(STARTING_BOUNDED);
</script>

<template>
    <PageSplitPaneFrame>
        <SplitPane v-model:ratios="ratios" :panes="BOUNDED" ariaLabel="Bounded panes">
            <template #renderPane="{ index }">
                <PageSplitPaneBox>{{ index === 0 ? "Sidebar 120–220px" : "Content min 160px" }}</PageSplitPaneBox>
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
