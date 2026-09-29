<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimePickerTrigger/TimePickerTrigger.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TimePickerTriggerProps } from "./TimePickerTrigger.types";

defineProps<TimePickerTriggerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.timePickerTrigger,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        ◷
    </div>
</template>
