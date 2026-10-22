<script setup lang="ts">
import { computed } from "vue";

import { PaginatorUtils } from "@thewaver/ss-components-vue";
import { RESULTS } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorPanelProps } from "./PaginatorContentVue.types";

const toResult = (itemNumber: number) => RESULTS[(itemNumber - 1) % RESULTS.length];

const props = defineProps<PaginatorPanelProps>();

const layerClass = useLayerClass();

const range = computed(() => PaginatorUtils.computeItemRange(props.page, props.itemCount, props.pageSize));

const summary = computed(() =>
    range.value === undefined
        ? "nothing to show"
        : `showing ${range.value.first} to ${range.value.last} of ${props.itemCount}`,
);

const itemNumbers = computed(() => {
    const current = range.value;

    return current === undefined
        ? []
        : Array.from({ length: current.last - current.first + 1 }, (_unused, offset) => current.first + offset);
});
</script>

<template>
    <div :class="[styles.paginatorPanel, layerClass]">
        <div :class="styles.paginatorPanelSummary" role="status">{{ summary }}</div>

        <div v-for="itemNumber in itemNumbers" :key="itemNumber" :class="styles.paginatorPanelRow">
            <span>{{ toResult(itemNumber) }}</span>

            <span :class="styles.paginatorPanelIndex">{{ `#${itemNumber}` }}</span>
        </div>
    </div>
</template>
