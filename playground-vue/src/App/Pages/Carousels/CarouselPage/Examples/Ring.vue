<script setup lang="ts">
import { shallowRef, useModel, watch } from "vue";

import {
    Button,
    Carousel,
    CarouselPlacementUtils,
    MediaQueryMonitorVueUtils,
    Tilter,
} from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CarouselExampleProps } from "../../Carousels.types";
import SlideBack from "./SlideBack.vue";
import SlideFront from "./SlideFront.vue";

const TILT_DEGREES = 18;

type Props = Pick<CarouselExampleProps, "slides" | "index" | "onUpdate:index">;

const props = defineProps<Props>();

const index = useModel(props, "index");

const progress = shallowRef(0);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isTurning = shallowRef(!prefersReducedMotion.value);

const toggleTurning = () => {
    isTurning.value = !isTurning.value;
};

watch(
    isTurning,
    (isOn, _wasOn, onCleanup) => {
        if (!isOn) return;

        let frameId: number;
        let lastMs = performance.now();

        const turn = () => {
            const nowMs = performance.now();

            progress.value = (progress.value + (nowMs - lastMs) / CarouselKnobs.RING_LAP_MS) % 1;
            lastMs = nowMs;
            frameId = requestAnimationFrame(turn);
        };

        frameId = requestAnimationFrame(turn);

        onCleanup(() => cancelAnimationFrame(frameId));
    },
    { immediate: true },
);
</script>

<template>
    <div :class="styles.ringStack">
        <div :class="styles.ringFrame">
            <Tilter :max-tilt-degrees="TILT_DEGREES">
                <Carousel
                    v-model:index="index"
                    v-model:progress="progress"
                    :compute-placement="CarouselPlacementUtils.drum"
                    :slides="slides"
                    ariaLabel="Turning ring"
                    :compute-slide-label="computePositionLabel"
                    :compute-step-label="computeCarouselStepLabel"
                    :compute-rotation-label="computeCarouselRotationLabel"
                >
                    <template #renderSlide="{ slide, state }">
                        <SlideFront :title="slide" :state="state" :is-narrow="false" />
                    </template>

                    <template #renderSlideBack>
                        <SlideBack :is-narrow="false" />
                    </template>
                </Carousel>
            </Tilter>
        </div>

        <Button id="ringTurn" @click="toggleTurning">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isTurning ? "Stop" : "Turn" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
