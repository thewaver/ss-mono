<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CarouselPickProps } from "./CarouselContent.types";

defineProps<CarouselPickProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.carouselPick,
            layerClass,
            renderProps.isCurrent && styles.isCurrent,
            renderProps.isHovered && styles.isHovered,
            renderProps.isActive && styles.isActive,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    />
</template>
