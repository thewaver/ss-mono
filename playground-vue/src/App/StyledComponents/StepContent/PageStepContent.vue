<script setup lang="ts">
import { MARKER_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { StepContentProps } from "./StepContentVue.types";

defineProps<StepContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            orientation === 'horizontal' ? styles.rowStep : styles.columnStep,
            layerClass,
            flags.isCurrent && styles.isCurrent,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <span :class="styles.marker[state]" aria-hidden="true">
            {{ MARKER_GLYPHS[state] || ordinal }}
        </span>

        <slot />
    </div>
</template>
