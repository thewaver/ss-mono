<script setup lang="ts">
import { computed } from "vue";

import { DEFAULT_RANGE_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContentVue.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

const HALF_DRAWN_THUMB = `${styles.RANGE_DRAWN_THUMB_WIDTH} * 0.5`;

const props = defineProps<RangeContentProps>();

const layerClass = useLayerClass();

const orientation = computed(() => props.renderProps.orientation);

const isPair = computed(() => props.renderProps.ratios.length > 1);

const length = computed(() => props.length ?? DEFAULT_RANGE_CONTENT_LENGTH);

const fill = computed(() => props.renderProps.fill);

const fillStart = computed(() => (isPair.value ? `calc(${center(fill.value.start)} - ${HALF_DRAWN_THUMB})` : "0px"));

const fillSpan = computed(() => `calc(${center(fill.value.end)} + ${HALF_DRAWN_THUMB} - ${fillStart.value})`);
</script>

<template>
    <div
        :class="[
            styles.rangeContent,
            styles.rangeContentVariants[orientation],
            layerClass,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        :style="orientation === 'vertical' ? { height: `${length}px` } : { width: `${length}px` }"
    >
        <div
            :class="[
                styles.rangeTrack,
                styles.rangeTrackVariants[orientation],
                renderProps.hasError && styles.hasError,
            ]"
        />

        <div
            :class="[styles.rangeFill, styles.rangeFillVariants[orientation], renderProps.hasError && styles.hasError]"
            :style="
                orientation === 'vertical'
                    ? { bottom: fillStart, height: fillSpan }
                    : { insetInlineStart: fillStart, width: fillSpan }
            "
        />

        <div
            v-for="(ratio, index) in renderProps.ratios"
            :key="index"
            :class="[
                styles.rangeThumb,
                styles.rangeThumbVariants[orientation],
                renderProps.focusVisibleThumb === index && styles.isFocused,
                renderProps.hasError && styles.hasError,
                isPair && index === 0 && styles.isStart,
                isPair && index === 1 && styles.isEnd,
            ]"
            :style="orientation === 'vertical' ? { bottom: travel(ratio) } : { insetInlineStart: travel(ratio) }"
        />
    </div>
</template>
