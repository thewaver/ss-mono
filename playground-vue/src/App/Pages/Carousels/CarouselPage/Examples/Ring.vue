<script setup lang="ts">
import { shallowRef, useModel, watch } from "vue";

import { Button, Carousel, MediaQueryMonitorVueUtils, Tilter } from "@thewaver/ss-components-vue";
import type { CarouselPlacementFn } from "@thewaver/ss-components-vue";
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
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
const PERCENT = 100;

type Props = Pick<CarouselExampleProps, "slides" | "index" | "onUpdate:index" | "isDisabled" | "orientation">;

const props = defineProps<Props>();

const index = useModel(props, "index");

const computeRingPlacement: CarouselPlacementFn = (defs) => {
    const along = defs.orientation === "horizontal" ? defs.size.width : defs.size.height;
    const angle = (defs.distance * FULL_TURN_DEGREES) / Math.max(defs.count, 1);
    const radians = (angle * Math.PI) / HALF_TURN_DEGREES;
    const radius = along * CarouselKnobs.RING_RADIUS_RATIO;
    const alongPercent = along > 0 ? ((radius * Math.sin(radians)) / along) * PERCENT : 0;
    const depth = radius * (Math.cos(radians) - 1);

    return {
        effect: {
            perspective: CarouselKnobs.RING_PERSPECTIVE_PX,
            translate3d: defs.orientation === "horizontal" ? [alongPercent, 0, depth] : [0, alongPercent, depth],
            ...(defs.orientation === "horizontal" ? { rotateY: angle } : { rotateX: -angle }),
        },
        layer: Math.cos(radians),
    };
};

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
            <div :class="[styles.ringFrame, orientation === 'vertical' && styles.ringFrameVertical]">
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
                            <SlideFront :title="slide" :state="state" :is-narrow="false" />
                        </template>

                        <template #renderSlideBack>
                            <SlideBack :is-narrow="false" />
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
