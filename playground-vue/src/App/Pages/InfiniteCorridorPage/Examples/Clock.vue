<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Button, InfiniteCorridor, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorClockExampleProps } from "../InfiniteCorridorPageVue.types";
import Room from "./Room.vue";

type Props = InfiniteCorridorClockExampleProps;

const props = defineProps<Props>();

const progress = shallowRef(0);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isWalking = shallowRef(!prefersReducedMotion.value);

watch(prefersReducedMotion, (isReduced) => {
    if (isReduced) isWalking.value = false;
});

watch(
    [isWalking, () => props.lapMs],
    ([isOn, lap], _previous, onCleanup) => {
        if (!isOn) return;

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            progress.value = (progress.value + (nowMs - lastMs) / lap) % 1;
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        onCleanup(() => cancelAnimationFrame(frameId));
    },
    { immediate: true },
);

const spinDegrees = useSpinDegrees(() => props.spinDegreesPerSecond, isWalking);

const layout = computed(() => props.toLayout(spinDegrees.value));

const toggleWalking = () => {
    isWalking.value = !isWalking.value;
};
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.frame">
            <InfiniteCorridor
                v-model:progress="progress"
                :items="items"
                :layout="layout"
                :glide-duration-ms="glideDurationMs"
                ariaLabel="Walking corridor"
            >
                <template #renderItem="{ item, state }">
                    <Room :name="item" :state="state" />
                </template>
            </InfiniteCorridor>
        </div>

        <Button id="corridorWalk" :ariaLabel="isWalking ? 'Pause' : 'Walk'" @click="toggleWalking">
            <template #renderContent="flags">
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="isWalking ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
            </template>
        </Button>
    </div>
</template>
