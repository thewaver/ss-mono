<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.vue";

type Props = {
    isNarrow: boolean;
};

defineProps<Props>();
</script>

<template>
    <div :class="[styles.slideFrame, isNarrow && styles.slideFrameNarrow]">
        <PageCarouselSlideBack />
    </div>
</template>
