<script setup lang="ts">
import type { CarouselStep } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CarouselStepProps } from "./CarouselContent.types";

const STEP_GLYPHS: Record<CarouselStep, string> = {
    previous: "‹",
    next: "›",
};

defineProps<CarouselStepProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.carouselButton,
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isActive && styles.isActive,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ STEP_GLYPHS[renderProps.step] }}
    </div>
</template>
