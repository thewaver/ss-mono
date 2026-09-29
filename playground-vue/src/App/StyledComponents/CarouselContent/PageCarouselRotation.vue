<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CarouselRotationProps } from "./CarouselContent.types";

const ROTATION_GLYPHS = {
    playing: "❙❙",
    stopped: "▶",
};

defineProps<CarouselRotationProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.carouselButton,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ flags.isPlaying ? ROTATION_GLYPHS.playing : ROTATION_GLYPHS.stopped }}
    </div>
</template>
