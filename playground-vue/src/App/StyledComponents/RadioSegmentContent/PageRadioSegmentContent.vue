<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioSegmentContentProps } from "./RadioSegmentContent.types";

defineProps<RadioSegmentContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.segmentContent,
            layerClass,
            flags.checkedState === true && styles.isChecked,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <slot />
    </div>
</template>
