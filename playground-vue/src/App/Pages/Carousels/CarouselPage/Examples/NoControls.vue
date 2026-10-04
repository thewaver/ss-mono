<script setup lang="ts">
import { useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

type Props = CarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <Carousel
        v-model:index="index"
        :compute-placement="computePlacement"
        :slides="slides"
        :is-disabled="isDisabled"
        :orientation="orientation"
        ariaLabel="Bare sampler"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
    >
        <template #renderSlide="{ slide, state }">
            <SlideFront :title="slide" :state="state" :frame-class="frameClasses.front" />
        </template>

        <template #renderSlideBack>
            <SlideBack :frame-class="frameClasses.back" />
        </template>
    </Carousel>
</template>
