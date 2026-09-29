<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionPanelProps } from "./AccordionContent.types";

defineProps<AccordionPanelProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.accordionPanel, layerClass]"
        :style="{
            opacity: visibilityTarget,
            transition: `opacity ${transitionDurationMs}ms`,
        }"
    >
        <slot />
    </div>
</template>
