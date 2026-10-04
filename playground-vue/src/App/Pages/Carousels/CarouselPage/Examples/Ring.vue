<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

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
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import type { CarouselExampleProps } from "../../Carousels.types";

const TILT_DEGREES = 18;

type Props = Pick<CarouselExampleProps, "slides" | "index" | "onUpdate:index" | "isDisabled" | "orientation">;

const props = defineProps<Props>();

const index = useModel(props, "index");

const computeRingPlacement = CarouselPlacementUtils.createPaddleWheel({
    perspectivePx: CarouselKnobs.RING_PERSPECTIVE_PX,
});

const frameClasses = computed(() => styles.ringFrames[props.orientation]);

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
        <Tilter :max-tilt-degrees="TILT_DEGREES">
            <div :class="styles.ringFrame">
                <div :class="styles.ringSlot">
                    <Carousel
                        v-model:index="index"
                        v-model:progress="progress"
                        :compute-placement="computeRingPlacement"
                        :slides="slides"
                        :is-disabled="isDisabled"
                        :orientation="orientation"
                        ariaLabel="Turning ring"
                        :compute-slide-label="computePositionLabel"
                        :compute-step-label="computeCarouselStepLabel"
                        :compute-rotation-label="computeCarouselRotationLabel"
                    >
                        <template #renderSlide="{ slide, state }">
                            <div :class="frameClasses.front">
                                <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                            </div>
                        </template>

                        <template #renderSlideBack="{ slide, state }">
                            <div :class="frameClasses.back">
                                <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                            </div>
                        </template>
                    </Carousel>
                </div>
            </div>
        </Tilter>

        <Button id="ringTurn" @click="toggleTurning">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isTurning ? "Stop" : "Turn" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
