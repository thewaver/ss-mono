<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.calendarWeekday, layerClass]" aria-hidden="true">
        <slot />
    </div>
</template>
