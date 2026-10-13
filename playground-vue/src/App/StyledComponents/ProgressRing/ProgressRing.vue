<script setup lang="ts">
import { computed } from "vue";

import {
    CIRCUMFERENCE,
    HALF,
    INDETERMINATE_ARC,
    PERCENT,
    RADIUS,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressRingProps } from "./ProgressRingVue.types";

const props = defineProps<ProgressRingProps>();

const layerClass = useLayerClass();

const ratio = computed(() => props.state.ratio);

const shownRatio = computed(() => ratio.value ?? INDETERMINATE_ARC);
</script>

<template>
    <div
        :class="[
            styles.progressRing,
            layerClass,
            ratio === undefined && styles.isIndeterminate,
            state.hasError && styles.hasError,
        ]"
    >
        <svg
            :class="styles.progressRingSvg"
            :width="styles.RING_SIZE"
            :height="styles.RING_SIZE"
            :viewBox="`0 0 ${styles.RING_SIZE} ${styles.RING_SIZE}`"
            aria-hidden="true"
        >
            <circle
                :class="styles.progressRingTrack"
                :cx="styles.RING_SIZE * HALF"
                :cy="styles.RING_SIZE * HALF"
                :r="RADIUS"
                :stroke-width="styles.RING_STROKE"
            />
            <circle
                :class="styles.progressRingFill"
                :cx="styles.RING_SIZE * HALF"
                :cy="styles.RING_SIZE * HALF"
                :r="RADIUS"
                :stroke-width="styles.RING_STROKE"
                :stroke-dasharray="`${CIRCUMFERENCE}`"
                :stroke-dashoffset="`${CIRCUMFERENCE * (1 - shownRatio)}`"
            />
        </svg>

        <div :class="styles.progressRingReadout" aria-hidden="true">
            {{ ratio === undefined ? "…" : `${Math.round(ratio * PERCENT)}%` }}
        </div>
    </div>
</template>
