<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTrailTrackProps } from "./TrailContent.types";

defineProps<PageTrailTrackProps>();

const layerClass = useLayerClass();
</script>

<template>
    <path :class="[styles.trailTrack, layerClass]" :d="path" />
</template>
