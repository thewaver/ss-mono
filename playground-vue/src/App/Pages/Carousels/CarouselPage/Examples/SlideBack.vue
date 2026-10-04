<script setup lang="ts">
import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.vue";

type Props = {
    frameClass: string;
};

defineProps<Props>();
</script>

<template>
    <div :class="frameClass">
        <PageCarouselSlideBack />
    </div>
</template>
