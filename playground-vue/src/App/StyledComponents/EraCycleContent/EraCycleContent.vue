<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/EraCycleContent/EraCycleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { EraCycleContentProps } from "./EraCycleContent.types";

defineProps<EraCycleContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.eraCycle,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        <slot />
    </div>
</template>
