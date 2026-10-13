<script setup lang="ts">
import type { ImageSwitcherProps } from "@thewaver/ss-components-vue";
import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.const";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DefaultExample from "./Examples/Default.vue";

const props = defineProps<ImageSwitcherProps>();
</script>

<template>
    <PageMeasureBox :width="IMAGE_CONTAINER_SIZE" :height="IMAGE_CONTAINER_SIZE">
        <DefaultExample v-bind="props" />
    </PageMeasureBox>
</template>
