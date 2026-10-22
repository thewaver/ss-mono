<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Carousel } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import PageCarouselsBar from "../../PageCarouselsBar.vue";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

type Props = CarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
const playback = useModel(props, "playback");

const controls = shallowRef<CarouselControls>();
</script>

<template>
    <Carousel
        v-model:index="index"
        v-model:playback="playback"
        :placement="placement"
        :slides="slides"
        :is-disabled="isDisabled"
        :is-looping="isLooping"
        :orientation="orientation"
        :transition-duration-ms="transitionDurationMs"
        :autoplay-delay-ms="autoplayDelayMs"
        ariaLabel="Rotating sampler"
        :compute-slide-label="computePositionLabel"
        @mount="(next: CarouselControls) => (controls = next)"
    >
        <template #renderSlide="{ slide, state }">
            <SlideFront :title="slide" :state="state" :frame-class="frameClasses.front" />
        </template>

        <template #renderSlideBack>
            <SlideBack :frame-class="frameClasses.back" />
        </template>
    </Carousel>

    <PageCarouselsBar v-if="controls" :controls="controls" :is-disabled="isDisabled" has-picks has-rotation />
</template>
