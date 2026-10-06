<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ControlButtonContentProps } from "./ControlButtonContent.types";

defineProps<ControlButtonContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.controlButton,
            layerClass,
            glyph !== undefined && styles.controlButtonGlyph,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        :aria-hidden="glyph !== undefined || undefined"
    >
        <template v-if="glyph !== undefined">{{ glyph }}</template>
        <slot v-else />
    </div>
</template>
