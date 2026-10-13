<script setup lang="ts">
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../ControlButtonContent/ControlButtonContent.vue";
import type { CarouselRotationProps } from "./CarouselContentVue.types";

defineProps<CarouselRotationProps>();
</script>

<template>
    <PageControlButtonContent :flags="flags" :glyph="flags.isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play" />
</template>
