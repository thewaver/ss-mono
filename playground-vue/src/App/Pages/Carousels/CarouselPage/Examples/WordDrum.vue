<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Carousel, CarouselPlacementUtils, ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselExampleProps } from "../../Carousels.types";

const computeWordDrumPlacement = CarouselPlacementUtils.createDrum({
    faceCount: CarouselKnobs.WORD_DRUM_FACE_COUNT,
    faceRatio: CarouselKnobs.WORD_DRUM_FACE_RATIO,
    perspectivePx: CarouselKnobs.WORD_DRUM_PERSPECTIVE_PX,
});

type Props = Pick<CarouselExampleProps, "index" | "onUpdate:index" | "isDisabled">;

const props = defineProps<Props>();

const index = useModel(props, "index");

const boxRef = shallowRef<HTMLElement>();
const runwayRef = shallowRef<HTMLElement>();

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef);
</script>

<template>
    <div id="wordDrumScrollBox" ref="boxRef" :class="styles.scrollBox">
        <div :class="styles.scrollPinned">
            <div :class="styles.wordDrumSlot">
                <Carousel
                    v-model:index="index"
                    :compute-placement="computeWordDrumPlacement"
                    :slides="CarouselKnobs.WORD_DRUM_WORDS"
                    :progress="progress"
                    :is-looping="false"
                    :is-disabled="isDisabled"
                    orientation="vertical"
                    ariaLabel="Words on a drum"
                    :compute-slide-label="computePositionLabel"
                    :compute-step-label="computeCarouselStepLabel"
                    :compute-rotation-label="computeCarouselRotationLabel"
                >
                    <template #renderSlide="{ slide }">
                        <div :class="styles.wordDrumWord">{{ slide }}</div>
                    </template>

                    <template #renderSlideBack></template>
                </Carousel>
            </div>
        </div>

        <div ref="runwayRef" :class="styles.scrollRunway" />
    </div>
</template>
