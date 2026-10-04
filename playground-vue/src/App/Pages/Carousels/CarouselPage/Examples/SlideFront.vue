<script setup lang="ts">
import type { CarouselSlideState } from "@thewaver/ss-components-vue";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";

type Props = {
    title: string;
    state: CarouselSlideState;
    frameClass: string;
};

defineProps<Props>();
</script>

<template>
    <div :class="frameClass">
        <PageCarouselSlide :state="state">{{ title }}</PageCarouselSlide>
    </div>
</template>
