<script setup lang="ts">
import type { PaginatorStep } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorStepContentProps } from "./PaginatorContent.types";

const STEP_GLYPHS: Record<PaginatorStep, string> = {
    first: "«",
    previous: "‹",
    next: "›",
    last: "»",
};

defineProps<PaginatorStepContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.paginatorStep,
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isActive && styles.isActive,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ STEP_GLYPHS[renderProps.step] }}
    </div>
</template>
