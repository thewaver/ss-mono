<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTimelineMarkerProps } from "./TimelineContent.types";

defineProps<PageTimelineMarkerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div v-if="marker.isInView" :class="[`${styles.timelineMarker} ${styles.timelineMarkerTones[tone]}`, layerClass]" />
</template>
