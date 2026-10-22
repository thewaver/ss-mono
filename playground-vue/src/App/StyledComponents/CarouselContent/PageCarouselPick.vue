<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CarouselPickProps } from "./CarouselContentVue.types";

defineProps<CarouselPickProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.carouselPick,
            layerClass,
            isCurrent && styles.isCurrent,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    />
</template>
