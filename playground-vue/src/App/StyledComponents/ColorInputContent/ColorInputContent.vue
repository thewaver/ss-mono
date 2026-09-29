<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorInputContent/ColorInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ColorInputContentProps } from "./ColorInputContent.types";

defineProps<ColorInputContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.colorInputContent,
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
        aria-hidden="true"
    >
        <div :class="styles.colorInputSwatch" :style="{ backgroundColor: renderProps.value }" />

        <div v-if="!isCompact" :class="styles.colorInputValue">{{ renderProps.value }}</div>
    </div>
</template>
