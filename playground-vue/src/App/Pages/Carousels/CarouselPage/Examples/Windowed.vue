<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import PageCarouselsBar from "../../PageCarouselsBar.vue";
import SlideBack from "./SlideBack.vue";
import WindowedSlide from "./WindowedSlide.vue";

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

type Props = Omit<CarouselExampleProps, "slides"> & {
    onBuiltChange: (change: number) => void;
};

const props = defineProps<Props>();

const index = useModel(props, "index");

const controls = shallowRef<CarouselControls>();
</script>

<template>
    <Carousel
        v-model:index="index"
        :placement="placement"
        :slides="SLIDES"
        :is-disabled="isDisabled"
        :is-looping="isLooping"
        is-windowed
        :orientation="orientation"
        :transition-duration-ms="transitionDurationMs"
        ariaLabel="A hundred slides"
        :compute-slide-label="computePositionLabel"
        @mount="(next: CarouselControls) => (controls = next)"
    >
        <template #renderSlide="{ slide, state }">
            <WindowedSlide
                :title="slide"
                :state="state"
                :frame-class="frameClasses.front"
                @built-change="onBuiltChange"
            />
        </template>

        <template #renderSlideBack>
            <SlideBack :frame-class="frameClasses.back" />
        </template>
    </Carousel>

    <PageCarouselsBar v-if="controls" :controls="controls" :is-disabled="isDisabled" />
</template>
