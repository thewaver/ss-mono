<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import type { CarouselSlideState } from "@thewaver/ss-components-vue";

import SlideFront from "./SlideFront.vue";

const BUILT = 1;

type Props = {
    title: string;
    state: CarouselSlideState;
    frameClass: string;
    onBuiltChange: (change: number) => void;
};

const props = defineProps<Props>();

onMounted(() => props.onBuiltChange(BUILT));

onUnmounted(() => props.onBuiltChange(-BUILT));
</script>

<template>
    <SlideFront :title="title" :state="state" :frame-class="frameClass" />
</template>
