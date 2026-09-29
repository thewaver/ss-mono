<script setup lang="ts">
import type { ImageSwitcherProps } from "@thewaver/ss-components-vue";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DefaultExample from "./Examples/Default.vue";

const IMAGE_CONTAINER_SIZE = 480;

const props = defineProps<ImageSwitcherProps>();
</script>

<template>
    <PageMeasureBox :width="IMAGE_CONTAINER_SIZE" :height="IMAGE_CONTAINER_SIZE">
        <DefaultExample v-bind="props" />
    </PageMeasureBox>
</template>
