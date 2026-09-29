<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ColorFieldTriggerProps } from "./ColorAreaContent.types";

defineProps<ColorFieldTriggerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.colorFieldTrigger,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
