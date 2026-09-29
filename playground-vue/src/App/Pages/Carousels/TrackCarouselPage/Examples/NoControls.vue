<script setup lang="ts">
import { useModel } from "vue";

import { TrackCarousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import type { CarouselExampleProps } from "../../Carousels.types";

type Props = CarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <TrackCarousel
        v-model:index="index"
        :slides="slides"
        :is-disabled="isDisabled"
        :orientation="orientation"
        ariaLabel="Bare sampler"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
    >
        <template #renderSlide="{ slide, state }">
            <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
        </template>
    </TrackCarousel>
</template>
