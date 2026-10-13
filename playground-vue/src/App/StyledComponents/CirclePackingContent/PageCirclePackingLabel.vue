<script setup lang="ts">
import {
    LABEL_HIDDEN,
    LABEL_SHOWN,
} from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageCirclePackingLabelProps } from "./CirclePackingContentVue.types";

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
