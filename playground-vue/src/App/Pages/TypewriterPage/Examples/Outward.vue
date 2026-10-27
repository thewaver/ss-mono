<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, MediaQueryMonitorVueUtils, Typewriter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT =
    "Scroll this past the middle of the box and it comes apart line by line: the first half flies off to the left, the second to the right, and back again on the way down.";
const FLY_BAND_PX = 80;
const CHARACTER_DELAY_MS = 40;
const CHARACTER_DURATION_MS = 500;
const HALF = 0.5;

const boxRef = shallowRef<HTMLElement>();
const paragraphRef = shallowRef<HTMLElement>();

const travel = ElementObserverVueUtils.useScrollContainerProgress(paragraphRef, boxRef);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const flown = computed(() => {
    travel.value;

    return TypewriterPageUtils.computeMiddleLineShare(boxRef.value, paragraphRef.value, FLY_BAND_PX);
});

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
                :animation-delay-ms="CHARACTER_DELAY_MS"
                :animation-duration-ms="CHARACTER_DURATION_MS"
                >{{ TEXT }}</Typewriter
            >
        </div>
    </div>
</template>
