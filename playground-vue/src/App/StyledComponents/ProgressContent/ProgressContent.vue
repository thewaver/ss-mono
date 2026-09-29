<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContent.types";

const PERCENT = 100;

defineProps<ProgressContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.progressRow, layerClass]">
        <div
            :class="[
                styles.progressTrack,
                state.ratio === undefined && styles.isIndeterminate,
                state.hasError && styles.hasError,
            ]"
        >
            <div :class="styles.progressFill" :style="{ width: `${(state.ratio ?? 0) * PERCENT}%` }" />
        </div>

        <div :class="styles.progressReadout" aria-hidden="true">
            {{ state.ratio === undefined ? "working…" : `${Math.round(state.ratio * PERCENT)}% of ${state.max}` }}
        </div>
    </div>
</template>
