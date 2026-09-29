<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CarouselSlideProps } from "./CarouselContent.types";

defineProps<CarouselSlideProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.carouselSlide, layerClass]">
        <div :class="styles.carouselSlideTitle"><slot /></div>
        <div :class="styles.carouselSlideBody">{{ `slide ${state.index + 1} of ${state.count}` }}</div>
    </div>
</template>
