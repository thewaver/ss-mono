<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    ElementObserverVueUtils,
    MediaQueryMonitorVueUtils,
    ScrambleTextWeights,
    Typewriter,
} from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { MathUtils } from "@thewaver/ss-utils";

const TEXT = "Scroll me past the middle";
const FLY_FROM = 0.4;
const FLY_SPAN = 0.25;
const CHARACTER_DELAY_MS = 40;
const CHARACTER_DURATION_MS = 500;
const HALF = 0.5;

const boxRef = shallowRef<HTMLElement>();
const paragraphRef = shallowRef<HTMLElement>();

const travel = ElementObserverVueUtils.useScrollContainerProgress(paragraphRef, boxRef);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const flown = computed(() => MathUtils.clamp01((travel.value - FLY_FROM) / FLY_SPAN));

const computeAnimationName = (_character: string, index: number, count: number) => {
    if (prefersReducedMotion.value) return styles.typewriterFadeOut;

    return index < count * HALF ? styles.typewriterFlyLeft : styles.typewriterFlyRight;
};
</script>

<template>
    <div id="outwardScrollBox" ref="boxRef" :class="styles.scrollBox">
        <div ref="paragraphRef" :class="styles.scrollParagraph">
            <Typewriter
                :progress="flown"
                :playback="false"
                :compute-animation-name="computeAnimationName"
                :compute-character-weights="ScrambleTextWeights.SAMPLE_WEIGHTS.fromMiddle"
                :animation-delay-ms="CHARACTER_DELAY_MS"
                :animation-duration-ms="CHARACTER_DURATION_MS"
                >{{ TEXT }}</Typewriter
            >
        </div>
    </div>
</template>
