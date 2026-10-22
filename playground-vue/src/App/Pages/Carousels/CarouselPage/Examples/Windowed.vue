<script setup lang="ts">
import { useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.vue";
import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.vue";
import type { CarouselExampleProps } from "../../Carousels.types";
import SlideBack from "./SlideBack.vue";
import WindowedSlide from "./WindowedSlide.vue";

const CAROUSEL_GAP = 10;

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

type Props = Omit<CarouselExampleProps, "slides"> & {
    onBuiltChange: (change: number) => void;
};

const props = defineProps<Props>();

const index = useModel(props, "index");
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
        :gap="CAROUSEL_GAP"
        ariaLabel="A hundred slides"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
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

        <template #renderStep="{ renderProps }">
            <PageCarouselStep :render-props="renderProps" />
        </template>

        <template #renderControls="controls">
            <PageCarouselBar>
                <component :is="controls.renderStep('previous')" />
                <component :is="controls.renderStep('next')" />
            </PageCarouselBar>
        </template>
    </Carousel>
</template>
