<script setup lang="ts">
import { useId } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageCirclePackingCircleProps } from "./CirclePackingContent.types";

defineProps<PageCirclePackingCircleProps>();

const layerClass = useLayerClass();

const gradientId = useId();
</script>

<template>
    <defs>
        <radialGradient :id="gradientId" :cx="0.7" :cy="0.3" :r="0.8">
            <stop
                :offset="0"
                :class="state.isBranch ? styles.circlePackingStopLight : styles.circlePackingLeafStopLight"
            />
            <stop
                :offset="1"
                :class="state.isBranch ? styles.circlePackingStopDark : styles.circlePackingLeafStopDark"
            />
        </radialGradient>
    </defs>

    <circle
        :class="[styles.circlePackingCircle, layerClass, state.isBranch && styles.circlePackingBranch]"
        :style="{ fill: `url(#${gradientId})` }"
        :cx="state.x"
        :cy="state.y"
        :r="Math.max(0, state.radius)"
    >
        <title>{{ title }}</title>
    </circle>
</template>
