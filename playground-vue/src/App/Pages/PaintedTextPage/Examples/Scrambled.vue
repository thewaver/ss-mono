<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-vue";
import type { ScrambleTextController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import type { Size2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

const props = defineProps<PaintedTextBoxedExampleProps>();

const id = useId();

const controller = shallowRef<ScrambleTextController>();

const setController = (next: ScrambleTextController) => {
    controller.value = next;
};

const restart = () => {
    controller.value?.restartAnimation();
};

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <div :class="[styles.fill, styles.typedHeading]">
                <ScrambleText :settle-duration-ms="1800" @mount="setController">
                    <PaintedText
                        :compute-fill-defs="computeFillDefs"
                        :compute-stroke-defs="computeStrokeDefs"
                        :stroke-width="strokeWidth"
                        :stroke-alignment="strokeAlignment"
                    >
                        Build 1.4.3 ready
                    </PaintedText>
                </ScrambleText>
            </div>
        </PageMeasureBox>

        <Button id="scrambleAgain" ariaLabel="Scramble it again" @click="restart">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
            </template>
        </Button>
    </div>
</template>
