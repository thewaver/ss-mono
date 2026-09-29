<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorPanelProps } from "./PaginatorContent.types";

const PAGE_SIZE = 3;
const FIRST_PAGE = 1;

const RESULTS = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];

const toResult = (index: number) => RESULTS[index % RESULTS.length];

const props = defineProps<PaginatorPanelProps>();

const layerClass = useLayerClass();

const firstIndex = computed(() => (Math.max(props.page, FIRST_PAGE) - FIRST_PAGE) * PAGE_SIZE);

const total = computed(() => Math.max(props.pageCount, 0) * PAGE_SIZE);

const indexes = computed(() =>
    Array.from({ length: PAGE_SIZE }, (_unused, offset) => firstIndex.value + offset).filter(
        (index) => index < total.value,
    ),
);
</script>

<template>
    <div :class="[styles.paginatorPanel, layerClass]">
        <div :class="styles.paginatorPanelSummary" role="status">
            {{
                indexes.length === 0
                    ? "nothing to show"
                    : `showing ${firstIndex + FIRST_PAGE} to ${firstIndex + indexes.length} of ${total}`
            }}
        </div>

        <div v-for="index in indexes" :key="index" :class="styles.paginatorPanelRow">
            <span>{{ toResult(index) }}</span>

            <span :class="styles.paginatorPanelIndex">{{ `#${index + FIRST_PAGE}` }}</span>
        </div>
    </div>
</template>
