<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavMenuContent/NavMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { NavMenuTriggerProps } from "./NavMenuContent.types";

defineProps<NavMenuTriggerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <span
        :class="[styles.navMenuTrigger, layerClass, flags.isHovered && styles.isHovered, flags.isOpen && styles.isOpen]"
    >
        <slot />

        <span :class="styles.navMenuChevron" aria-hidden="true">▾</span>
    </span>
</template>
