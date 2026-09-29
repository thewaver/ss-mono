<script setup lang="ts">
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import TrackedShape from "./TrackedShape.vue";

type Props = TrackedGradientExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <TrackedShape v-bind="props" />
</template>
