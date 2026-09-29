<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioContent/RadioContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioContentProps } from "./RadioContent.types";

defineProps<RadioContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.radioContent,
            layerClass,
            flags.checkedState === true && styles.isChecked,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <div :class="styles.radioMarker">
            <div :class="styles.radioDot" />
        </div>

        <slot />
    </div>
</template>
