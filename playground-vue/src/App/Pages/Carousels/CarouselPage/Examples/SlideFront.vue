<script setup lang="ts">
import type { CarouselSlideState } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";

type Props = {
    title: string;
    state: CarouselSlideState;
    isNarrow: boolean;
};

defineProps<Props>();
</script>

<template>
    <div :class="[styles.slideFrame, isNarrow && styles.slideFrameNarrow]">
        <PageCarouselSlide :state="state">{{ title }}</PageCarouselSlide>
    </div>
</template>
