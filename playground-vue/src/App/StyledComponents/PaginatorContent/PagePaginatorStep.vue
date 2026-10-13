<script setup lang="ts">
import { STEP_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorStepContentProps } from "./PaginatorContentVue.types";

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
