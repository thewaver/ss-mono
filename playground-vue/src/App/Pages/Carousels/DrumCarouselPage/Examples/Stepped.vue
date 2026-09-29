<script setup lang="ts">
import { useModel } from "vue";

import { DrumCarousel } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.vue";
import PageCarouselPick from "../../../../StyledComponents/CarouselContent/PageCarouselPick.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.vue";
import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.vue";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const CAROUSEL_GAP = 10;
const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <DrumCarousel
        v-model:index="index"
        :slides="slides"
        :is-disabled="isDisabled"
        :axis="axis"
        :slide-size="SLIDE_SIZE"
        :gap="CAROUSEL_GAP"
        ariaLabel="Barrel sampler"
        :compute-slide-label="computePositionLabel"
        :compute-step-label="computeCarouselStepLabel"
        :compute-rotation-label="computeCarouselRotationLabel"
    >
        <template #renderSlide="{ slide, state }">
            <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
        </template>

        <template #renderSlideBack>
            <PageCarouselSlideBack />
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
    </DrumCarousel>
</template>
