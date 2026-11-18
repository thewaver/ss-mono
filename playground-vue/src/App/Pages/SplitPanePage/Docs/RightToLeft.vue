<script setup lang="ts">
import { shallowRef } from "vue";

import { SplitPane } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    RIGHT_TO_LEFT,
    STARTING_RIGHT_TO_LEFT,
    TWO_PANES_RIGHT_LEFT_LABEL,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.css";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.vue";
import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.vue";
import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.vue";

const ratios = shallowRef(STARTING_RIGHT_TO_LEFT);
</script>

<template>
    <div dir="rtl" :class="styles.docsDirectionBox">
        <PageSplitPaneFrame>
            <SplitPane v-model:ratios="ratios" :panes="RIGHT_TO_LEFT" :ariaLabel="TWO_PANES_RIGHT_LEFT_LABEL">
                <template #renderPane="{ index }">
                    <PageSplitPaneBox>{{ index === 0 ? "Navigation" : "Content" }}</PageSplitPaneBox>
                </template>

                <template #renderGutter="flags">
                    <PageSplitPaneGutter :flags="flags" orientation="horizontal" />
                </template>
            </SplitPane>
        </PageSplitPaneFrame>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Ratios: ${SplitPanePageUtils.toPercentText(ratios)}` }}
    </div>
</template>
