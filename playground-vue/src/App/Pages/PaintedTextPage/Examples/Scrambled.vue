<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-vue";
import type { ScrambleTextController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

const props = defineProps<PaintedTextExampleProps>();

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

        <Button id="scrambleAgain" @click="restart">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Scramble it again</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
