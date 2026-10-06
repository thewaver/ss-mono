<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ScrambleText } from "@thewaver/ss-components-vue";
import type { ScrambleTextController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const HEADLINE = "SYSTEM ONLINE";
const BOX_WIDTH = 320;

type Props = ScrambleTextExampleProps;

defineProps<Props>();

const controller = shallowRef<ScrambleTextController>();

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
                    :text="HEADLINE"
                    :compute-glyphs="computeGlyphs"
                    :settle-duration-ms="settleDurationMs"
                    :scramble-interval-ms="scrambleIntervalMs"
                    :compute-character-weights="computeCharacterWeights"
                    @mount="setController"
                />
            </div>
        </PageMeasureBox>

        <Button id="runItAgain" ariaLabel="Run it again" @click="restart">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
            </template>
        </Button>
    </div>
</template>
