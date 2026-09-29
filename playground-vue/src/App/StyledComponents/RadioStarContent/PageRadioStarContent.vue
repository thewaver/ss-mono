<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioStarContent/RadioStarContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioStarContentProps } from "./RadioStarContent.types";

defineProps<RadioStarContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.starContent,
            layerClass,
            isFilled && styles.isFilled,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <span aria-hidden="true">★</span>
    </div>
</template>
