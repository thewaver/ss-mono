<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.timelineRow, layerClass]"><slot /></div>
</template>
