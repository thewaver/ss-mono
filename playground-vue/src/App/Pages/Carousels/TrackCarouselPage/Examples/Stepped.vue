<script setup lang="ts">
import { useModel } from "vue";

import { TrackCarousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.vue";
import PageCarouselPick from "../../../../StyledComponents/CarouselContent/PageCarouselPick.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.vue";
import type { CarouselExampleProps } from "../../Carousels.types";

const CAROUSEL_GAP = 10;

type Props = CarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <TrackCarousel
        v-model:index="index"
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
            <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
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
    </TrackCarousel>
</template>
