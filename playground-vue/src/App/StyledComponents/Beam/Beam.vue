<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch, watchEffect } from "vue";

import {
    computeBeamLengthPx,
    computeBeamMotion,
    observeBeamLength,
} from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

const NO_LENGTH = 0;

const props = defineProps<PageBeamProps>();

const pathRef = shallowRef<SVGPathElement>();
const lengthPx = shallowRef(NO_LENGTH);

let stopObserving: (() => void) | undefined;

watch(pathRef, (path) => {
    stopObserving?.();
    stopObserving = path
        ? observeBeamLength(path, (value) => {
              lengthPx.value = value;
          })
        : undefined;
});

watch(
    () => props.d,
    () => {
        if (pathRef.value) lengthPx.value = computeBeamLengthPx(pathRef.value);
    },
    { flush: "post", immediate: true },
);

watch(lengthPx, (value) => props.onLengthPx?.(value), { immediate: true });

const motion = computed(() =>
    computeBeamMotion({
        lengthPx: lengthPx.value,
        startPx: props.routeStartPx ?? NO_LENGTH,
        totalPx: props.routeLengthPx ?? lengthPx.value,
        direction: props.direction,
    }),
);

watchEffect(
    (onCleanup) => {
        const path = pathRef.value;
        const { fromPx, toPx, durationMs } = motion.value;

        if (!path || durationMs <= NO_LENGTH) return;

        const animation = path.animate([{ strokeDashoffset: `${fromPx}px` }, { strokeDashoffset: `${toPx}px` }], {
            duration: durationMs,
            iterations: Infinity,
        });

        animation.currentTime = performance.now() % durationMs;

        if (!props.isPlaying) animation.pause();

        onCleanup(() => animation.cancel());
    },
    { flush: "post" },
);

onBeforeUnmount(() => {
    stopObserving?.();
    props.onLengthPx?.(undefined);
});
</script>

<template>
    <path ref="pathRef" :class="styles.beam" :style="{ strokeDasharray: motion.dashArray }" :d="d" data-beam />
</template>
