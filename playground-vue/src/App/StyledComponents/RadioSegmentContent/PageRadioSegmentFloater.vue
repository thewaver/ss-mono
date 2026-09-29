<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioSegmentFloaterProps } from "./RadioSegmentContent.types";

defineProps<RadioSegmentFloaterProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.segmentFloater, layerClass, visibilityTarget === 1 && styles.isVisible]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
        data-floater=""
    />
</template>
