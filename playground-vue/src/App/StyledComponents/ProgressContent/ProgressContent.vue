<script setup lang="ts">
import { computed } from "vue";

import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentVue.types";

const props = defineProps<ProgressContentProps>();

const layerClass = useLayerClass();

const isVertical = computed(() => (props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical");

const fillLength = computed(() => (props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`));
</script>

<template>
    <div :class="[styles.progressRow, layerClass, isVertical && styles.isVertical]">
        <div
            :class="[
                styles.progressTrack,
                state.ratio === undefined && styles.isIndeterminate,
                state.hasError && styles.hasError,
                isVertical && styles.isVertical,
            ]"
        >
            <div
                :class="[styles.progressFill, isVertical && styles.isVertical]"
                :style="isVertical ? { height: fillLength } : { width: fillLength }"
            />
        </div>

        <div :class="styles.progressReadout" aria-hidden="true">
            <bdi>{{
                state.ratio === undefined ? "working…" : `${Math.round(state.ratio * PERCENT)}% of ${state.max}`
            }}</bdi>
        </div>
    </div>
</template>
