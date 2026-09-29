<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MeridiemToggleContent/MeridiemToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { MeridiemToggleContentProps } from "./MeridiemToggleContent.types";

defineProps<MeridiemToggleContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.meridiemToggle,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ meridiem === "am" ? "AM" : "PM" }}
    </div>
</template>
