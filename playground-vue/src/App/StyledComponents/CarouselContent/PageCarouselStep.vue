<script setup lang="ts">
import { STEP_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.const";

import PageControlButtonContent from "../ControlButtonContent/ControlButtonContent.vue";
import type { CarouselStepProps } from "./CarouselContentVue.types";

defineProps<CarouselStepProps>();
</script>

<template>
    <PageControlButtonContent :flags="flags" :glyph="STEP_GLYPHS[step]" />
</template>
