<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTimelineLanesProps } from "./TimelineContent.types";

defineProps<PageTimelineLanesProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.timelineLanes, layerClass]">
        <div
            v-for="(name, index) in names"
            :key="index"
            :class="styles.timelineLaneName"
            :style="{
                height: `${laneSize}px`,
                marginTop: index === 0 ? undefined : `${laneGap}px`,
            }"
        >
            {{ name }}
        </div>
    </div>
</template>
