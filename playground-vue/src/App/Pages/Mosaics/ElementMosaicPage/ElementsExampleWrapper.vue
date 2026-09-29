<script setup lang="ts">
import { computed } from "vue";

import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import type { MosaicSharedProps } from "../Mosaics.types";
import ElementsExample from "./Examples/Elements.vue";

const props = defineProps<MosaicSharedProps>();

const items = computed(() => TILES.slice(0, props.itemCount));
</script>

<template>
    <PageMeasureBox
        :width="sizeAnchor === 'width' ? MOSAIC_EXTENT : undefined"
        :height="sizeAnchor === 'height' ? MOSAIC_EXTENT : undefined"
    >
        <ElementsExample
            :items="items"
            :gap="gap"
            :size-anchor="sizeAnchor"
            :transition-duration-ms="transitionDurationMs"
        />
    </PageMeasureBox>
</template>
