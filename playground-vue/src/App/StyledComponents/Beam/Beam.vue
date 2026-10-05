<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from "vue";

import { computeBeamLengthPx, observeBeamLength } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { PageBeamProps } from "./Beam.types";

const props = defineProps<PageBeamProps>();

const pathRef = shallowRef<SVGPathElement>();
const lengthPx = shallowRef(0);

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

onBeforeUnmount(() => stopObserving?.());
</script>

<template>
    <path
        ref="pathRef"
        :class="[styles.beam, styles.beamDirectionVariants[direction], !isPlaying && styles.beamPaused]"
        :style="assignInlineVars({ [styles.beamLengthVar]: `${lengthPx}px` })"
        :d="d"
        data-beam
    />
</template>
