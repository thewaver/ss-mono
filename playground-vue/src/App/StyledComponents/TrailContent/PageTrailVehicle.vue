<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTrailVehicleProps } from "./TrailContent.types";

defineProps<PageTrailVehicleProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :id="id" :class="[styles.trailVehicle, layerClass]" aria-hidden="true">
        {{ label }}
    </div>
</template>
