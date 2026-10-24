<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, SlideButton } from "@thewaver/ss-components-vue";
import {
    FINALE_CYCLE_MS,
    FINALE_PAUSE_MS,
    LOCK_COUNT,
    TURN_DEG,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.vue";
import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonArmingExampleProps } from "../SlideButtonPageVue.types";

type Props = SlideButtonArmingExampleProps;

const LOCKS = Array.from({ length: LOCK_COUNT }, (_, index) => index);

const NONE_ARMED = LOCKS.map(() => false);

const props = defineProps<Props>();

const progresses = ref(LOCKS.map(() => 0));
const armed = shallowRef(NONE_ARMED);
const isFinale = shallowRef(false);
const finaleRatio = shallowRef(0);
const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

let resetTimer: ReturnType<typeof setTimeout> | undefined;
let cycleFrame: number | undefined;

onBeforeUnmount(() => {
    clearTimeout(resetTimer);
    cancelAnimationFrame(cycleFrame ?? 0);
});

const cycle = (startedAt: number) => {
    cycleFrame = requestAnimationFrame((now) => {
        const ratio = Math.min(1, (now - startedAt) / FINALE_CYCLE_MS);

        finaleRatio.value = ratio;

        if (ratio < 1) cycle(startedAt);
    });
};

const reset = () => {
    isFinale.value = false;
    finaleRatio.value = 0;
    armed.value = NONE_ARMED;
    props.onArmedCountChange(0);
};

const arm = (lock: number) => {
    if (armed.value[lock] || isFinale.value) return;

    const next = armed.value.map((isArmed, index) => isArmed || index === lock);

    armed.value = next;
    props.onArmedCountChange(next.filter(Boolean).length);

    if (!next.every(Boolean)) return;

    const isCycling = !prefersReducedMotion.value;

    isFinale.value = true;

    if (isCycling) cycle(performance.now());

    resetTimer = setTimeout(reset, (isCycling ? FINALE_CYCLE_MS : 0) + FINALE_PAUSE_MS);
};

const turn = (lock: number) => (armed.value[lock] ? 1 : progresses.value[lock]) * TURN_DEG;
</script>

<template>
    <PageControlColumn>
        <div
            v-for="lock in LOCKS"
            :key="lock"
            :class="[styles.lock, armed[lock] && styles.isArmed, isFinale && styles.isFinale]"
            :style="assignInlineVars({ [styles.turnVar]: String(turn(lock)), [styles.liftVar]: String(finaleRatio) })"
        >
            <SlideButton
                v-model:progress="progresses[lock]"
                :ariaLabel="`Lock ${lock + 1}`"
                ariaDescription="Hold Enter or Space to arm."
                :is-pressed="armed[lock]"
                :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
                @activate="arm(lock)"
            >
                <template #renderContent="renderProps">
                    <PageSlideButtonContent :render-props="renderProps">Slide or hold to arm</PageSlideButtonContent>
                </template>
            </SlideButton>
        </div>
    </PageControlColumn>
</template>
