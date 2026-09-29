<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SatelliteContent/SatelliteContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSatelliteBadgeProps } from "./SatelliteContent.types";

defineProps<PageSatelliteBadgeProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.satelliteBadge, layerClass, isMuted && styles.satelliteBadgeMuted]"
        :style="{ width: `${size}px`, height: `${size}px` }"
    >
        <slot />
    </div>
</template>
