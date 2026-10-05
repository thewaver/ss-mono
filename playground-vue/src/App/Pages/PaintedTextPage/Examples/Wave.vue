<script setup lang="ts">
import { useId, useModel } from "vue";

import { Button, PaintedText } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextPathExampleProps } from "../PaintedTextPage.types";

const WAVE_PATH = "M 0 60 C 45 0 90 0 135 60 S 225 120 270 60 S 360 0 405 60 S 495 120 540 60";
const WAVE_TEXT = "Riding the wave, round and round • ";

type Props = PaintedTextPathExampleProps;

const props = defineProps<Props>();

const id = useId();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const togglePlayback = () => {
    playback.value = !playback.value;
};

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.waveText">
                <PaintedText
                    v-model:progress="progress"
                    v-model:playback="playback"
                    :path="WAVE_PATH"
                    :lap-duration-ms="lapDurationMs"
                    :compute-fill-defs="computeFillDefs"
                    :compute-stroke-defs="computeStrokeDefs"
                    :stroke-width="strokeWidth"
                    :stroke-alignment="strokeAlignment"
                >
                    {{ WAVE_TEXT }}
                </PaintedText>
            </div>
        </PageMeasureBox>

        <div :class="styles.buttonRow">
            <Button id="wavePlayback" @click="togglePlayback">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ playback ? "Pause" : "Play" }}</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
