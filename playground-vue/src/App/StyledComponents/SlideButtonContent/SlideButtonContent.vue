<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SlideButtonContentProps } from "./SlideButtonContent.types";

const DEFAULT_SLIDE_BUTTON_CONTENT_WIDTH = styles.SLIDE_BUTTON_WIDTH;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

const covered = (ratio: number) =>
    `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE / 2}px)`;

const props = defineProps<SlideButtonContentProps>();

const layerClass = useLayerClass();

const width = computed(() => props.width ?? DEFAULT_SLIDE_BUTTON_CONTENT_WIDTH);

const ratio = computed(() => (props.renderProps.isPressed ? 1 : props.renderProps.progressRatio));

const isTracking = computed(() => props.renderProps.isDragging || props.renderProps.isHolding);
</script>

<template>
    <div
        :class="[
            styles.slideButtonContent,
            layerClass,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
        :style="{ width: `${width}px` }"
    >
        <div :class="[styles.slideButtonFill, isTracking && styles.isTracking]" :style="{ width: covered(ratio) }" />

        <div :class="styles.slideButtonHint" :style="{ opacity: 1 - ratio }">
            <slot />
        </div>

        <div
            :class="[
                styles.slideButtonThumb,
                isTracking && styles.isTracking,
                renderProps.isFocusVisible && styles.isFocused,
            ]"
            :style="{ left: travel(ratio) }"
        >
            <svg :class="styles.slideButtonArrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" />
            </svg>
        </div>
    </div>
</template>
