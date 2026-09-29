<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeContentProps } from "./RangeContent.types";

const DEFAULT_RANGE_CONTENT_LENGTH = styles.RANGE_LENGTH;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

const center = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE / 2}px)`;

const props = defineProps<RangeContentProps>();

const layerClass = useLayerClass();

const orientation = computed(() => props.renderProps.orientation);

const length = computed(() => props.length ?? DEFAULT_RANGE_CONTENT_LENGTH);

const fill = computed(() => props.renderProps.fill);

const fillSpan = computed(() => travel(fill.value.end - fill.value.start));
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
        <div :class="[styles.rangeTrack, styles.rangeTrackVariants[orientation]]" />

        <div
            :class="[styles.rangeFill, styles.rangeFillVariants[orientation], renderProps.hasError && styles.hasError]"
            :style="
                orientation === 'vertical'
                    ? { bottom: center(fill.start), height: fillSpan }
                    : { left: center(fill.start), width: fillSpan }
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
            ]"
            :style="orientation === 'vertical' ? { bottom: travel(ratio) } : { left: travel(ratio) }"
        />
    </div>
</template>
