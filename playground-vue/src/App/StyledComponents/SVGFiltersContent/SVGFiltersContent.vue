<script setup lang="ts">
import { Comment } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

import type { PageFilterStageProps, PageFilterStageSlots } from "./SVGFiltersContent.types";

defineProps<PageFilterStageProps>();

const slots = defineSlots<PageFilterStageSlots>();

const hasDefs = () => (slots.renderDefs?.() ?? []).some((node) => node.type !== Comment);
</script>

<template>
    <div :class="styles.filterStageRoot">
        <svg :class="styles.filterStageDefs" aria-hidden="true">
            <defs><slot name="renderDefs" /></defs>
        </svg>

        <div
            :class="styles.filterStageSubject"
            :style="{ filter: hasDefs() ? `url(#${filterId})` : undefined }"
            :data-subject="filterId"
        >
            <span :class="styles.filterStageWord">{{ label }}</span>
        </div>
    </div>
</template>
