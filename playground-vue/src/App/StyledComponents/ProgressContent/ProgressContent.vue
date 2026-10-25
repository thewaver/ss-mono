<script setup lang="ts">
import { PERCENT } from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentVue.types";

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
            <div
                :class="styles.progressFill"
                :style="{ width: state.ratio === undefined ? undefined : `${state.ratio * PERCENT}%` }"
            />
        </div>

        <div :class="styles.progressReadout" aria-hidden="true">
            <bdi>{{
                state.ratio === undefined ? "working…" : `${Math.round(state.ratio * PERCENT)}% of ${state.max}`
            }}</bdi>
        </div>
    </div>
</template>
