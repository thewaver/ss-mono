<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageCirclePackingLabelProps } from "./CirclePackingContent.types";

const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

defineProps<PageCirclePackingLabelProps>();

const layerClass = useLayerClass();
</script>

<template>
    <text
        :class="[styles.circlePackingLabel, layerClass]"
        :style="{
            fillOpacity: state.isInView ? LABEL_SHOWN : LABEL_HIDDEN,
            strokeOpacity: state.isInView ? LABEL_SHOWN : LABEL_HIDDEN,
        }"
        :x="state.x"
        :y="state.y"
        text-anchor="middle"
        dy="0.35em"
    >
        {{ name }}
    </text>
</template>
