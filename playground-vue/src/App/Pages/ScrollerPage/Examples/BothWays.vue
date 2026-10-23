<script setup lang="ts">
import { Scroller } from "@thewaver/ss-components-vue";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.vue";
import type { ScrollerExampleProps } from "../ScrollerPageVue.types";

const SCROLLER_GAP = 10;
const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.bothWaysDemo">
        <Scroller
            :gap="SCROLLER_GAP"
            :padding="FOCUS_RING_WIDTH"
            :overflow-x="overflowX"
            :overflow-y="overflowY"
            :is-auto-hiding="isAutoHiding"
            :hide-delay-ms="hideDelayMs"
            :is-bar-overlaid="isBarOverlaid"
        >
            <template #renderButton="{ step, stepper, axis }">
                <PageScrollerButton :step="step" :stepper="stepper" :axis="axis" />
            </template>

            <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                <PageScrollerBarContent
                    :render-props="renderProps"
                    :set-track-ref="setTrackRef"
                    :set-thumb-ref="setThumbRef"
                />
            </template>

            <div :class="styles.cellGrid">
                <template v-for="row in INDICES" :key="row">
                    <div v-for="column in INDICES" :key="column" :class="styles.chip">
                        {{ getGridCellLabel(row, column) }}
                    </div>
                </template>
            </div>
        </Scroller>
    </div>
</template>
