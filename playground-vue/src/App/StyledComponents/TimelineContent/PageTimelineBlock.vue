<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTimelineBlockProps } from "./TimelineContent.types";

defineProps<PageTimelineBlockProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            `${styles.timelineBlock} ${styles.timelineBlockTones[tone]}`,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isFocusVisible && styles.isFocusVisible,
            flags.isDisabled && styles.isDisabled,
            flags.heldEdge === 'start' && styles.isHeldStart,
            flags.heldEdge === 'end' && styles.isHeldEnd,
        ]"
    >
        <span :class="styles.timelineBlockName">{{ name }}</span>
        <span :class="styles.timelineBlockNote">{{ note }}</span>
    </div>
</template>
