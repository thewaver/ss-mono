<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DatePickerTrigger/DatePickerTrigger.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";

defineProps<DatePickerTriggerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.datePickerTrigger,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        ▦
    </div>
</template>
