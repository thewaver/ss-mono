<script setup lang="ts">
import type { SortableGridGeometry } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableGridLandingProps } from "./SortableGridContent.types";

const getBox = (geometry: SortableGridGeometry) => ({
    width: Math.max(...geometry.contour.map((point) => point.x)),
    height: Math.max(...geometry.contour.map((point) => point.y)),
});

const getPoints = (geometry: SortableGridGeometry) =>
    geometry.contour.map((point) => `${point.x},${point.y}`).join(" ");

const getViewBox = (geometry: SortableGridGeometry) => {
    const box = getBox(geometry);

    return `0 0 ${box.width} ${box.height}`;
};

defineProps<SortableGridLandingProps>();

const layerClass = useLayerClass();
</script>

<template>
    <svg
        :class="[styles.sortableGridLanding, layerClass, isAllowed && styles.isAllowed]"
        :viewBox="getViewBox(geometry)"
        aria-hidden="true"
    >
        <polygon :class="styles.sortableGridLandingContour" :points="getPoints(geometry)" />
    </svg>
</template>
