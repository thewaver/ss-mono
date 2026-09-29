<script setup lang="ts">
import { computed } from "vue";

import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import type { WalkedExampleWrapperProps } from "./ElementMosaicPage.types";
import WalkedExample from "./Examples/Walked.vue";

const props = defineProps<WalkedExampleWrapperProps>();

const items = computed(() => TILES.slice(0, props.itemCount));
</script>

<template>
    <PageMeasureBox
        :width="sizeAnchor === 'width' ? MOSAIC_EXTENT : undefined"
        :height="sizeAnchor === 'height' ? MOSAIC_EXTENT : undefined"
    >
        <WalkedExample
            :items="items"
            :gap="gap"
            :size-anchor="sizeAnchor"
            :transition-duration-ms="transitionDurationMs"
            :picked-names="pickedNames"
            @activate="(index: number) => props.onActivate(index)"
        />
    </PageMeasureBox>
</template>
