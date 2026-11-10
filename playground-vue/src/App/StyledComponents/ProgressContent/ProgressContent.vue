<script setup lang="ts">
import { computed } from "vue";

import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentVue.types";

const props = defineProps<ProgressContentProps>();

const layerClass = useLayerClass();

const isVertical = computed(() => (props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical");

const isIndeterminate = computed(() => props.state.ratio === undefined);

const fillLength = computed(() => (props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`));

const fillStyle = computed(() => (isVertical.value ? { height: fillLength.value } : { width: fillLength.value }));

const valueVars = computed(() =>
    isIndeterminate.value
        ? undefined
        : assignInlineVars({
              [skinVars.startValue]: "0",
              [skinVars.endValue]: `${props.state.ratio}`,
          }),
);
</script>

<template>
    <div :class="[styles.progressRow, layerClass, isVertical && styles.isVertical]" :style="valueVars">
        <div :class="[styles.progressBar, state.hasError && styles.hasError]">
            <div
                :class="[
                    styles.progressTrack,
                    isIndeterminate && styles.isIndeterminate,
                    state.hasError && styles.hasError,
                    isVertical && styles.isVertical,
                ]"
            >
                <div
                    v-if="isIndeterminate"
                    :class="[styles.progressFill, isVertical && styles.isVertical]"
                    :style="fillStyle"
                />
            </div>

            <template v-if="!isIndeterminate">
                <div :class="[styles.progressFill, isVertical && styles.isVertical]" :style="fillStyle" />

                <div
                    :class="[styles.progressTipAnchor, isVertical && styles.isVertical]"
                    :style="isVertical ? { bottom: fillLength } : { insetInlineStart: fillLength }"
                    aria-hidden="true"
                >
                    <div
                        :class="[
                            styles.progressTip,
                            state.hasError && styles.hasError,
                            isVertical && styles.isVertical,
                        ]"
                    />
                </div>
            </template>
        </div>

        <div :class="styles.progressReadout" aria-hidden="true">
            <bdi>{{
                state.ratio === undefined ? "working…" : `${Math.round(state.ratio * PERCENT)}% of ${state.max}`
            }}</bdi>
        </div>
    </div>
</template>
