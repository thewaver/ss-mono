<script setup lang="ts">
import type { CarouselStep } from "@thewaver/ss-components-vue";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../ControlButtonContent/ControlButtonContent.vue";
import type { CarouselStepProps } from "./CarouselContent.types";

const STEP_GLYPHS: Record<CarouselStep, string> = {
    previous: CONTROL_GLYPHS.previous,
    next: CONTROL_GLYPHS.next,
};

defineProps<CarouselStepProps>();
</script>

<template>
    <PageControlButtonContent :flags="renderProps" :glyph="STEP_GLYPHS[renderProps.step]" />
</template>
