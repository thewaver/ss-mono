<script setup lang="ts">
import { ImageSwitcher } from "@thewaver/ss-components-vue";
import type { ImageSwitcherProps } from "@thewaver/ss-components-vue";

const props = defineProps<ImageSwitcherProps>();
</script>

<template>
    <ImageSwitcher :src="src" :alt="alt" :transition-duration-ms="transitionDurationMs" @load="props.onLoad" />
</template>
