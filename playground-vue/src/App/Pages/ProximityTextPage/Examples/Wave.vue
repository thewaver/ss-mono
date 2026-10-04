<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Button, MediaQueryMonitorVueUtils, ProximityText } from "@thewaver/ss-components-vue";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ProximityTextExampleProps } from "../ProximityTextPageVue.types";

const MIDDLE = 0.5;
const OVERSHOOT = 0.4;

type Props = ProximityTextExampleProps;

defineProps<Props>();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isMoving = shallowRef(!prefersReducedMotion.value);
const x = shallowRef(-OVERSHOOT);

const pointSource = computed(() => ({ ratio: { x: x.value, y: MIDDLE } }));

const toggleMoving = () => {
    isMoving.value = !isMoving.value;
};

watch(
    isMoving,
    (isOn, _wasOn, onCleanup) => {
        if (!isOn) return;

        let frameId: number;
        let lastMs = performance.now();

        const move = () => {
            const nowMs = performance.now();
            const span = 1 + OVERSHOOT * 2;

            x.value =
                ((x.value + OVERSHOOT + ((nowMs - lastMs) / ProximityTextKnobs.WAVE_LAP_MS) * span) % span) - OVERSHOOT;
            lastMs = nowMs;
            frameId = requestAnimationFrame(move);
        };

        frameId = requestAnimationFrame(move);

        onCleanup(() => cancelAnimationFrame(frameId));
    },
    { immediate: true },
);
</script>

<template>
    <div :class="styles.stack">
        <div :class="styles.variableText">
            <ProximityText :reach-px="reachPx" :is-disabled="isDisabled" :point-source="pointSource"
                >A wave of weight rolls through this line</ProximityText
            >
        </div>

        <Button id="waveMove" @click="toggleMoving">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isMoving ? "Stop" : "Move" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
