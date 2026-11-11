<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/Variants/Variants.css";

import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
import PageLayer from "../Layer/Layer.vue";
import type { VariantsProps } from "./Variants.types";

defineProps<VariantsProps>();

const nextLayerClass = useNextLayerClass();
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
            :class="[styles.variantContainer, nextLayerClass]"
            data-variant=""
            :data-testid="variant.key"
        >
            <PageLayer>
                <div :class="styles.variantTitle">{{ variant.name }}</div>

                <div :class="styles.variantDemo"><slot :name="variant.key" /></div>

                <div v-if="variant.readout" :class="styles.variantReadout" data-readout="">{{ variant.readout() }}</div>
            </PageLayer>
        </div>
    </div>
</template>
