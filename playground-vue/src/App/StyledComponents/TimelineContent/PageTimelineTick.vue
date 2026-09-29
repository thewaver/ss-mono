<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTimelineTickProps } from "./TimelineContent.types";

defineProps<PageTimelineTickProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.timelineRule, layerClass, tick.isMajor && styles.isMajor]" />

    <div :class="[styles.timelineTickLabel, layerClass]">{{ label }}</div>
</template>
