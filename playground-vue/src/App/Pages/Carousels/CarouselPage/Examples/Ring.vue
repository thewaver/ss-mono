<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { Button, Carousel, CarouselPlacementUtils, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { CarouselExampleProps } from "../../Carousels.types";

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

        <Button id="ringTurn" :ariaLabel="isTurning ? 'Pause' : 'Turn'" @click="toggleTurning">
            <template #renderContent="flags">
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="isTurning ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
            </template>
        </Button>
    </div>
</template>
