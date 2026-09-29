<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTrailMarkerProps } from "./TrailContent.types";

defineProps<PageTrailMarkerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :id="id" :class="[styles.trailMarker, layerClass]" aria-hidden="true" />
</template>
