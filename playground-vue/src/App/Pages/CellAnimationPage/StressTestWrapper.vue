<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import {
    STRESS_CELL_COUNT,
    STRESS_HOLD_MS,
    STRESS_ITEMS,
    STRESS_ITERATION_DELAY_MS,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

type Props = CellAnimationSourcedExampleProps & { computeWidth: (longestSide: number) => number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const isOnGraphicsCard = shallowRef(true);

const sharedProps = computed(() => {
    const {
        "playback": _playback,
        "onUpdate:playback": _setPlayback,
        "computeWidth": _computeWidth,
        ...shared
    } = props;

    return shared;
});

const stressPlaybackOpts = computed(() => ({ ...props.playbackOpts, holdMs: STRESS_HOLD_MS }));

const resume = () => {
    playback.value = true;
};

const pause = () => {
    playback.value = false;
};
</script>

<template>
    <div>{{ `${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells` }}</div>

    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp
            item-key="onGraphicsCard"
            label="On the graphics card"
            hint="Draws the stress test's cells in one canvas per item, with the keyframes worked out on the graphics card. Off, every cell is an element of its own."
            controls="Sets CellAnimationProps.renderer in the stress test"
        >
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS" @hide-modal="resume" @show-modal="pause">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} items` }}</template>

        <template #renderItem="{ configIndex }">
            <PageMeasureBox :width="computeWidth(STRESS_ITEMS[configIndex].size)">
                <DefaultExample
                    v-bind="sharedProps"
                    :playback-opts="stressPlaybackOpts"
                    :animation-iteration-delay-ms="STRESS_ITERATION_DELAY_MS"
                    v-model:playback="modalPlayback"
                    :cell-count="STRESS_CELL_COUNT"
                    :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
                />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
