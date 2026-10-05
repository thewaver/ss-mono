<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Range, Typewriter } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { TypewriterKaraokeExampleProps } from "../TypewriterPage.types";

const LYRIC = "Twinkle, twinkle, little star";
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 110;
const CHARACTER_DELAY_MS = 120;
const CHARACTER_DURATION_MS = 600;
const RUN_START = 0;
const RUN_END = 1;

type Props = TypewriterKaraokeExampleProps;

defineProps<Props>();

const progress = shallowRef(RUN_START);
const isPlaying = shallowRef(false);

const computeAnimationName = () => styles.typewriterSweep;

const togglePlaying = () => {
    if (!isPlaying.value && progress.value >= RUN_END) progress.value = RUN_START;

    isPlaying.value = !isPlaying.value;
};

const seek = (value: number) => {
    progress.value = value / PERCENT;
};
</script>

<template>
    <div :class="styles.karaokeStack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.karaokeLine">
                <Typewriter
                    v-model:progress="progress"
                    v-model:playback="isPlaying"
                    :compute-animation-name="computeAnimationName"
                    :animation-delay-ms="CHARACTER_DELAY_MS"
                    :animation-duration-ms="CHARACTER_DURATION_MS"
                    @animation-end="isPlaying = false"
                    >{{ LYRIC }}</Typewriter
                >
            </div>
        </PageMeasureBox>

        <div :class="styles.karaokeControls">
            <Button id="karaokePlay" @click="togglePlaying">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ isPlaying ? "Pause" : "Sing" }}</PageButtonContent>
                </template>
            </Button>

            <Range
                id="karaokeScrubber"
                sizing="fill"
                ariaLabel="How far the line has been sung"
                :min="0"
                :max="PERCENT"
                :step="SLIDER_STEP"
                :value="Math.round(progress * PERCENT)"
                @update:value="seek"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" :length="SLIDER_LENGTH" />
                </template>
            </Range>
        </div>
    </div>
</template>
