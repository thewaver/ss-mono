<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { Button, MediaQueryMonitorVueUtils, PaintedText, Typewriter } from "@thewaver/ss-components-vue";
import type { TypewriterController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextBoxedExampleProps & {
    computeAnimationName: (character: string, index: number, count: number) => string;
};

const props = defineProps<Props>();

const id = useId();

const controller = shallowRef<TypewriterController>();

const isBlinkStopped = shallowRef(false);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const setController = (next: TypewriterController) => {
    controller.value = next;
};

const toggleBlink = () => {
    isBlinkStopped.value = !isBlinkStopped.value;
};

const restart = () => {
    controller.value?.restartAnimation();
};

const computeHeadingFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeHeadingStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);

const computeBodyFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", `${id}-body`, size, element);

const computeBodyStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", `${id}-body`, size, element);
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.fill">
                <Typewriter
                    :compute-animation-name="computeAnimationName"
                    :animation-delay-ms="40"
                    :animation-duration-ms="400"
                    @mount="setController"
                >
                    <template #default>
                        <div :class="styles.typedHeading">
                            <PaintedText
                                :compute-fill-defs="computeHeadingFillDefs"
                                :compute-stroke-defs="computeHeadingStrokeDefs"
                                :stroke-width="strokeWidth"
                                :stroke-alignment="strokeAlignment"
                            >
                                Typed and painted
                            </PaintedText>
                        </div>

                        <div :class="styles.paragraph">
                            <PaintedText
                                :compute-fill-defs="computeBodyFillDefs"
                                :compute-stroke-defs="computeBodyStrokeDefs"
                                :stroke-width="strokeWidth"
                                :stroke-alignment="strokeAlignment"
                            >
                                The heading types first, then this line carries on from where it ended.
                            </PaintedText>
                        </div>
                    </template>

                    <template #renderCaret>
                        <span
                            :class="[styles.caret, !isBlinkStopped && !prefersReducedMotion && styles.caretBlinking]"
                            aria-hidden="true"
                        />
                    </template>
                </Typewriter>
            </div>
        </PageMeasureBox>

        <div :class="styles.buttonRow">
            <Button id="typeAgain" @click="restart">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Type it again</PageButtonContent>
                </template>
            </Button>

            <Button id="toggleBlink" @click="toggleBlink">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">
                        {{ isBlinkStopped ? "Start blinking" : "Stop blinking" }}
                    </PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
