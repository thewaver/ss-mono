<script setup lang="ts">
import { useModel } from "vue";

import { DrumCarousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.vue";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <DrumCarousel
        v-model:index="index"
        :slides="slides"
        :is-disabled="isDisabled"
        :axis="axis"
        :slide-size="SLIDE_SIZE"
        ariaLabel="Bare barrel sampler"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
    >
        <template #renderSlide="{ slide, state }">
            <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
        </template>

        <template #renderSlideBack>
            <PageCarouselSlideBack />
        </template>
    </DrumCarousel>
</template>
