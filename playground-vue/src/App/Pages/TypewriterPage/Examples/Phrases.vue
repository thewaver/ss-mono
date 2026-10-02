<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from "vue";

import { Button, MediaQueryMonitorVueUtils, Typewriter } from "@thewaver/ss-components-vue";
import type { TypewriterMode } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { TypewriterPhrasesExampleProps } from "../TypewriterPage.types";

const LEAD = "We build";
const PHRASES = ["websites", "apps", "games"];
const FIRST_PHRASE = 0;
const HOLD_MS = 1600;
const CHARACTER_DELAY_MS = 80;
const CHARACTER_DURATION_MS = 200;
const NO_MOTION_MS = 0;

type Props = TypewriterPhrasesExampleProps;

defineProps<Props>();

const phraseIndex = shallowRef(FIRST_PHRASE);
const mode = shallowRef<TypewriterMode>("type");
const isPaused = shallowRef(false);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

let holdTimeout: ReturnType<typeof setTimeout> | undefined;
let isStepWaiting = false;

onBeforeUnmount(() => clearTimeout(holdTimeout));

const step = () => {
    isStepWaiting = false;

    if (mode.value === "type") {
        mode.value = "erase";

        return;
    }

    phraseIndex.value = (phraseIndex.value + 1) % PHRASES.length;
    mode.value = "type";
};

const requestStep = () => {
    if (isPaused.value) {
        isStepWaiting = true;

        return;
    }

    step();
};

const handleAnimationEnd = () => {
    clearTimeout(holdTimeout);

    if (mode.value === "erase") {
        requestStep();

        return;
    }

    holdTimeout = setTimeout(requestStep, HOLD_MS);
};

const togglePause = () => {
    isPaused.value = !isPaused.value;

    if (!isPaused.value && isStepWaiting) step();
};
</script>

<template>
    <div :class="styles.phraseStack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.phraseLine">
                <span>{{ LEAD }}</span>

                <div :class="styles.phraseSlot">
                    <Typewriter
                        :mode="mode"
                        :animation-name="animationName"
                        :animation-delay-ms="prefersReducedMotion ? NO_MOTION_MS : CHARACTER_DELAY_MS"
                        :animation-duration-ms="prefersReducedMotion ? NO_MOTION_MS : CHARACTER_DURATION_MS"
                        :compute-character-weights="computeCharacterWeights"
                        @animation-end="handleAnimationEnd"
                    >
                        <template #default>{{ PHRASES[phraseIndex] }}</template>

                        <template #renderCaret>
                            <span
                                :class="[
                                    styles.phraseCaret,
                                    !isPaused && !prefersReducedMotion && styles.phraseCaretBlinking,
                                ]"
                                aria-hidden="true"
                            />
                        </template>
                    </Typewriter>
                </div>
            </div>
        </PageMeasureBox>

        <Button id="pausePhrases" @click="togglePause">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isPaused ? "Resume" : "Pause" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
