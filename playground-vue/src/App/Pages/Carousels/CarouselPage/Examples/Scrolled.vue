<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Carousel, ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

type Props = Omit<CarouselExampleProps, "isLooping">;

const props = defineProps<Props>();

const index = useModel(props, "index");

const boxRef = shallowRef<HTMLElement>();
const runwayRef = shallowRef<HTMLElement>();

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef);
</script>

<template>
    <div id="carouselScrollBox" ref="boxRef" :class="styles.scrollBox">
        <div :class="styles.scrollPinned">
            <Carousel
                v-model:index="index"
                :compute-placement="computePlacement"
                :slides="slides"
                :progress="progress"
                :is-looping="false"
                :is-disabled="isDisabled"
                :orientation="orientation"
                ariaLabel="Scrolled sampler"
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
            </Carousel>
        </div>

        <div ref="runwayRef" :class="styles.scrollRunway" />
    </div>
</template>
