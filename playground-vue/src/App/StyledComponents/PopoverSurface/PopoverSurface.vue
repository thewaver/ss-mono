<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PopoverSurfaceProps } from "./PopoverSurface.types";

defineProps<PopoverSurfaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.popoverSurface,
            layerClass,
            visibilityTarget === 1 && styles.isVisible,
            placement.y === 'top-out' && styles.isFlipped,
        ]"
        :style="{
            transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`,
        }"
    >
        <slot />
    </div>
</template>
