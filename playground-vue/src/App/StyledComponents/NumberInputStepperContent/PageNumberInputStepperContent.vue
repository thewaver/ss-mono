<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NumberInputStepperContent/NumberInputStepperContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { NumberInputStepperContentProps } from "./NumberInputStepperContent.types";

defineProps<NumberInputStepperContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.numberInputStepperButton,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <span aria-hidden="true">{{ direction === "up" ? "▲" : "▼" }}</span>
        <span :class="styles.numberInputStepperName"><slot /></span>
    </div>
</template>
