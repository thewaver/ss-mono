<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ClockContent/ClockContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ClockOptionProps } from "./ClockContent.types";

defineProps<ClockOptionProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.clockOption,
            layerClass,
            renderProps.isSelected && styles.isSelected,
            renderProps.isNow && styles.isNow,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ renderProps.option.label }}
    </div>
</template>
