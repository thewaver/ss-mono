<script setup lang="ts">
import { computed } from "vue";

import { DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SlideButtonContentProps } from "./SlideButtonContentVue.types";

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

const covered = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE / 2}px)`;

const props = defineProps<SlideButtonContentProps>();

const layerClass = useLayerClass();

const length = computed(() => props.length ?? DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH);

const isVertical = computed(() => props.renderProps.orientation === "vertical");

const isRightToLeft = computed(() => !isVertical.value && props.renderProps.direction === "rtl");

const ratio = computed(() => (props.renderProps.isPressed ? 1 : props.renderProps.progressRatio));

const isTracking = computed(() => props.renderProps.isDragging || props.renderProps.isHolding);

const thumbStyle = computed(() => {
    const offset = travel(ratio.value);

    if (isVertical.value) return { bottom: offset };

    return isRightToLeft.value ? { right: offset } : { left: offset };
});
</script>

<template>
    <div
        :class="[
            styles.slideButtonContent,
            layerClass,
            isVertical && styles.isVertical,
            isRightToLeft && styles.isRightToLeft,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
        :style="isVertical ? { height: `${length}px` } : { width: `${length}px` }"
    >
        <div
            :class="[styles.slideButtonFill, isTracking && styles.isTracking]"
            :style="isVertical ? { height: covered(ratio) } : { width: covered(ratio) }"
        />

        <div :class="styles.slideButtonHint" :style="{ opacity: 1 - ratio }">
            <slot />
        </div>

        <div
            :class="[
                styles.slideButtonThumb,
                isTracking && styles.isTracking,
                renderProps.isFocusVisible && styles.isFocused,
            ]"
            :style="thumbStyle"
        >
            <svg :class="styles.slideButtonArrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" />
            </svg>
        </div>
    </div>
</template>
