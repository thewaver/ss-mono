<script setup lang="ts">
import { useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

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
        :placement="placement"
        :slides="slides"
        :is-disabled="isDisabled"
        :orientation="orientation"
        :transition-duration-ms="transitionDurationMs"
        ariaLabel="Bare sampler"
        :compute-slide-label="computePositionLabel"
    >
        <template #renderSlide="{ slide, state }">
            <SlideFront :title="slide" :state="state" :frame-class="frameClasses.front" />
        </template>

        <template #renderSlideBack>
            <SlideBack :frame-class="frameClasses.back" />
        </template>
    </Carousel>
</template>
