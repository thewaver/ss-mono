<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CalendarDayProps } from "./CalendarContent.types";

defineProps<CalendarDayProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.calendarDay,
            styles.isWide,
            layerClass,
            renderProps.isSelected && styles.isSelected,
            renderProps.isToday && styles.isToday,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        <slot />
    </div>
</template>
