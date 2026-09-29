<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { BreadcrumbContentProps } from "./BreadcrumbContent.types";

defineProps<BreadcrumbContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.breadcrumbContent,
            layerClass,
            flags.isCurrent && styles.isCurrent,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
