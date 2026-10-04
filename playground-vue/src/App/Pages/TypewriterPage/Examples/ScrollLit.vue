<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, Typewriter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { MathUtils } from "@thewaver/ss-utils";

const TEXT =
    "Every word here waits, dimmed, until the paragraph is scrolled into view, then lights up in reading order as it travels up the box — and dims again on the way back down.";
const LIT_FROM = 0.15;
const LIT_SPAN = 0.35;
const CHARACTER_DELAY_MS = 30;
const CHARACTER_DURATION_MS = 400;

const boxRef = shallowRef<HTMLElement>();
const paragraphRef = shallowRef<HTMLElement>();

const travel = ElementObserverVueUtils.useScrollContainerProgress(paragraphRef, boxRef);

const lit = computed(() => MathUtils.clamp01((travel.value - LIT_FROM) / LIT_SPAN));

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
