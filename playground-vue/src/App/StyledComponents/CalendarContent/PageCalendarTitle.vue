<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CalendarTitleProps } from "./CalendarContent.types";

defineProps<CalendarTitleProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.calendarTitle, layerClass, flags.isHovered && styles.isHovered]" aria-hidden="true">
        <slot />
    </div>
</template>
