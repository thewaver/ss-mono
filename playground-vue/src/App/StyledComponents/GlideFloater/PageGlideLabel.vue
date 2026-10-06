<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideLabelProps } from "./GlideFloater.types";

defineProps<GlideLabelProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.glideLabel, layerClass, isSelected && styles.isSelected, isDisabled && styles.isDisabled]">
        <slot />
    </div>
</template>
