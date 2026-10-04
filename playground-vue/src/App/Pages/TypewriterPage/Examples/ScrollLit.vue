<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, Typewriter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT =
    "Every word here waits, dimmed, until it reaches the middle of the box, then lights up in reading order as it passes — and dims again on the way back down.";
const LIT_BAND_PX = 24;
const CHARACTER_DELAY_MS = 30;
const CHARACTER_DURATION_MS = 400;

const boxRef = shallowRef<HTMLElement>();
const paragraphRef = shallowRef<HTMLElement>();

const travel = ElementObserverVueUtils.useScrollContainerProgress(paragraphRef, boxRef);

const lit = computed(() => {
    travel.value;

    return TypewriterPageUtils.computeMiddleLineShare(boxRef.value, paragraphRef.value, LIT_BAND_PX);
});

const computeAnimationName = () => styles.typewriterLight;
</script>

<template>
    <div id="scrollLitScrollBox" ref="boxRef" :class="styles.scrollBox">
        <div ref="paragraphRef" :class="styles.scrollParagraph">
            <Typewriter
                :progress="lit"
                :playback="false"
                :compute-animation-name="computeAnimationName"
                :animation-delay-ms="CHARACTER_DELAY_MS"
                :animation-duration-ms="CHARACTER_DURATION_MS"
                >{{ TEXT }}</Typewriter
            >
        </div>
    </div>
</template>
