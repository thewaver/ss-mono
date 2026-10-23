<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import {
    computeGroupPositionLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    computePairs,
    toPairableSlides,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";

import type { CarouselExampleProps } from "../../Carousels.types";
import PageCarouselsBar from "../../PageCarouselsBar.vue";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

type Props = CarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");

const controls = shallowRef<CarouselControls>();

const pairableSlides = computed(() => toPairableSlides(props.slides));
</script>

<template>
    <Carousel
        v-model:index="index"
        :placement="placement"
        :slides="pairableSlides"
        :is-disabled="isDisabled"
        :is-looping="isLooping"
        :orientation="orientation"
        :transition-duration-ms="transitionDurationMs"
        ariaLabel="Pairs"
        :compute-slide-label="computePositionLabel"
        :compute-groups="computePairs"
        :compute-group-label="computeGroupPositionLabel"
        @mount="(next: CarouselControls) => (controls = next)"
    >
        <template #renderSlide="{ slide, state }">
            <SlideFront :title="slide" :state="state" :frame-class="frameClasses.front" />
        </template>

        <template #renderSlideBack>
            <SlideBack :frame-class="frameClasses.back" />
        </template>
    </Carousel>

    <PageCarouselsBar v-if="controls" :controls="controls" :is-disabled="isDisabled" has-picks />
</template>
