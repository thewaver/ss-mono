<script setup lang="ts">
import { useId, useModel } from "vue";

import { Button, PaintedText } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import { WAVE_PATH, WAVE_TEXT } from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import type { Size2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPageVue.const";
import type { PaintedTextPathExampleProps } from "../PaintedTextPageVue.types";

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
            <Button id="wavePlayback" :ariaLabel="playback ? 'Pause' : 'Play'" @click="togglePlayback">
                <template #renderContent="flags">
                    <PageControlButtonContent
                        :flags="flags"
                        :glyph="playback ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                    />
                </template>
            </Button>
        </div>
    </div>
</template>
