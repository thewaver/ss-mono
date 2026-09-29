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
            layerClass,
            renderProps.isSelected && styles.isSelected,
            renderProps.isToday && styles.isToday,
            renderProps.isOutsideMonth && styles.isOutsideMonth,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.isInRange && styles.isInRange,
            renderProps.isRangeStart && styles.isRangeStart,
            renderProps.isRangeEnd && styles.isRangeEnd,
        ]"
        :data-in-range="renderProps.isInRange || undefined"
        :data-range-start="renderProps.isRangeStart || undefined"
        :data-range-end="renderProps.isRangeEnd || undefined"
        aria-hidden="true"
    >
        {{ renderProps.day.day }}
    </div>
</template>
