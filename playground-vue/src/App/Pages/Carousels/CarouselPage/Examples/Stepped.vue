<script setup lang="ts">
import { useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.vue";
import PageCarouselPick from "../../../../StyledComponents/CarouselContent/PageCarouselPick.vue";
import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.vue";
import type { CarouselExampleProps } from "../../Carousels.types";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

const CAROUSEL_GAP = 10;

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
        :is-looping="isLooping"
        :orientation="orientation"
        :gap="CAROUSEL_GAP"
        ariaLabel="Sampler"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
    >
        <template #renderSlide="{ slide, state }">
            <SlideFront :title="slide" :state="state" :is-narrow="isNarrow" />
        </template>

        <template #renderSlideBack>
            <SlideBack :is-narrow="isNarrow" />
        </template>

        <template #renderStep="{ renderProps }">
            <PageCarouselStep :render-props="renderProps" />
        </template>

        <template #renderPick="{ renderProps }">
            <PageCarouselPick :render-props="renderProps" />
        </template>

        <template #renderControls="controls">
            <PageCarouselBar>
                <component :is="controls.renderStep('previous')" />
                <component
                    :is="controls.renderPick(pickIndex)"
                    v-for="(_unused, pickIndex) in controls.count"
                    :key="pickIndex"
                />
                <component :is="controls.renderStep('next')" />
            </PageCarouselBar>
        </template>
    </Carousel>
</template>
