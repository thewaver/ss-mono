<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/Variants/Variants.css";

import PageLayer from "../Layer/Layer.vue";
import type { VariantsProps } from "./Variants.types";

defineProps<VariantsProps>();
</script>

<template>
    <div
        :class="styles.variantsRoot"
        :style="{
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${minColumnWidth ?? styles.DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`,
        }"
    >
        <div
            v-for="variant in items"
            :key="variant.key"
            :class="styles.variantContainer"
            data-variant=""
            :data-testid="variant.key"
        >
            <PageLayer :level="1">
                <div :class="styles.variantTitle">{{ variant.name }}</div>

                <div :class="styles.variantDemo"><slot :name="variant.key" /></div>

                <div v-if="variant.readout" :class="styles.variantReadout" data-readout="">{{ variant.readout() }}</div>
            </PageLayer>
        </div>
    </div>
</template>
