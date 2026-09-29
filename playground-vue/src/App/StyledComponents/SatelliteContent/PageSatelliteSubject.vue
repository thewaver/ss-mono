<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SatelliteContent/SatelliteContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSatelliteSubjectProps } from "./SatelliteContent.types";

defineProps<PageSatelliteSubjectProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.satelliteSubject, layerClass]" :style="{ width: `${width}px`, height: `${height}px` }">
        <slot />
    </div>
</template>
