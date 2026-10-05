<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { LightCatcher, Range } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageRangeContent from "../../../../StyledComponents/RangeContent/RangeContent.vue";
import type { LightCatcherExampleProps } from "../LightCatcherPageVue.types";

const LAMPS = [1, 2, 3, 4, 5];
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 360;
const STARTING_PERCENT = 20;
const MIDDLE = 0.5;

type Props = LightCatcherExampleProps;

defineProps<Props>();

const rowRef = shallowRef<HTMLElement>();
const percent = shallowRef(STARTING_PERCENT);

const pointSource = computed(() => ({ ratio: { x: percent.value / PERCENT, y: MIDDLE }, element: rowRef.value }));
</script>

<template>
    <div :class="styles.placedStage">
        <PageMeasureBox is-filling>
            <div ref="rowRef" :class="styles.placedRow">
                <div v-for="lamp in LAMPS" :key="lamp" :class="styles.lampSlot">
                    <LightCatcher
                        :is-disabled="isDisabled"
                        :active-range-px="activeRangePx"
                        :smoothing-ms="smoothingMs"
                        :light-range-px="lightRangePx"
                        :max-brightness="maxBrightness"
                        :resting-brightness="restingBrightness"
                        :max-lightness="maxLightness"
                        :resting-lightness="restingLightness"
                        :point-source="pointSource"
                    >
                        <div :class="styles.lamp">{{ lamp }}</div>
                    </LightCatcher>
                </div>
            </div>
        </PageMeasureBox>

        <div :class="styles.slider">
            <Range
                id="placedLightSlider"
                v-model:value="percent"
                sizing="fill"
                ariaLabel="Where the light is across the row"
                :min="0"
                :max="PERCENT"
                :step="SLIDER_STEP"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" :length="SLIDER_LENGTH" />
                </template>
            </Range>
        </div>
    </div>
</template>
