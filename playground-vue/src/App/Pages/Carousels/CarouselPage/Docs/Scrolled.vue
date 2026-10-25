<script setup lang="ts">
import { shallowRef } from "vue";

import { Carousel, CarouselPlacementUtils, ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

const boxRef = shallowRef<HTMLElement>();
const runwayRef = shallowRef<HTMLElement>();

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef);
</script>

<template>
    <div :class="styles.docsCarousel">
        <div ref="boxRef" :class="styles.scrollBox">
            <div :class="styles.scrollPinned">
                <Carousel
                    :placement="CarouselPlacementUtils.track"
                    :slides="SLIDES"
                    :progress="progress"
                    :is-looping="false"
                    ariaLabel="Scrolled"
                    :compute-slide-label="computePositionLabel"
                >
                    <template #renderSlide="{ slide, state }">
                        <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                    </template>
                </Carousel>
            </div>

            <div ref="runwayRef" :class="styles.scrollRunway" />
        </div>
    </div>
</template>
