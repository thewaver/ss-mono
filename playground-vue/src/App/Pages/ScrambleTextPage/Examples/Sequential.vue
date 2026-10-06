<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, ScrambleText } from "@thewaver/ss-components-vue";
import type { ScrambleTextController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
const BOX_WIDTH = 320;
const SINGLE_CHARACTER = 1;
const ROLLS_PER_CHARACTER = 6;
const RUN_MULTIPLIER = 4;
const MIN_INTERVAL_MS = 12;

type Props = ScrambleTextExampleProps;

const props = defineProps<Props>();

const controller = shallowRef<ScrambleTextController>();

const runDurationMs = computed(() => props.settleDurationMs * RUN_MULTIPLIER);

const churnDurationMs = computed(
    () => runDurationMs.value / Math.max(LINE.length - SINGLE_CHARACTER, SINGLE_CHARACTER),
);

const scrambleIntervalMs = computed(() => Math.max(churnDurationMs.value / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS));

const setController = (next: ScrambleTextController) => {
    controller.value = next;
};

const restart = () => {
    controller.value?.restartAnimation();
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="BOX_WIDTH" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.headline">
                <ScrambleText
                    :text="LINE"
                    :compute-glyphs="computeGlyphs"
                    :settle-duration-ms="runDurationMs"
                    :churn-duration-ms="churnDurationMs"
                    :scramble-interval-ms="scrambleIntervalMs"
                    @mount="setController"
                />
            </div>
        </PageMeasureBox>

        <Button id="revealAgain" ariaLabel="Reveal again" @click="restart">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
            </template>
        </Button>
    </div>
</template>
