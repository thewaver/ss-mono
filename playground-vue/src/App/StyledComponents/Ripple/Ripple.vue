<script setup lang="ts">
import { onUnmounted, shallowRef, watch } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/Ripple/Ripple.css";

import type { RippleMark, RippleProps } from "./Ripple.types";

const RIPPLE_DURATION_MS = 600;
const RATIO_TO_PERCENT = 100;

const props = defineProps<RippleProps>();

const marks = shallowRef<RippleMark[]>([]);

const timeouts = new Set<ReturnType<typeof setTimeout>>();

watch(
    () => props.activation?.count,
    () => {
        const mark = props.activation;

        if (mark === undefined) return;

        marks.value = marks.value.includes(mark) ? marks.value : [...marks.value, mark];

        const timeout = setTimeout(() => {
            timeouts.delete(timeout);
            marks.value = marks.value.filter((entry) => entry !== mark);
        }, RIPPLE_DURATION_MS);

        timeouts.add(timeout);
    },
    { immediate: true },
);

onUnmounted(() => {
    timeouts.forEach(clearTimeout);
    timeouts.clear();
});
</script>

<template>
    <div :class="styles.rippleRoot" :style="{ color }" aria-hidden="true">
        <div
            v-for="mark in marks"
            :key="mark.count"
            :class="styles.rippleMark"
            :style="{
                left: `${mark.ratio.x * RATIO_TO_PERCENT}%`,
                top: `${mark.ratio.y * RATIO_TO_PERCENT}%`,
                animationDuration: `${RIPPLE_DURATION_MS}ms`,
            }"
        />
    </div>
</template>
