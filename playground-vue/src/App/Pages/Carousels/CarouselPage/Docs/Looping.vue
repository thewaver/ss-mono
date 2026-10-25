<script setup lang="ts">
import { shallowRef } from "vue";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselsBar from "../../PageCarouselsBar.vue";
import type { CarouselLoopingDocsExampleProps } from "../CarouselPageVue.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselLoopingDocsExampleProps;

defineProps<Props>();

const controls = shallowRef<CarouselControls>();
</script>

<template>
    <div :class="styles.docsCarousel">
        <PageCarouselBox>
            <Carousel
                :placement="CarouselPlacementUtils.track"
                :slides="SLIDES"
                :is-looping="isLooping"
                :autoplay-delay-ms="autoplayDelayMs"
                ariaLabel="Rotating"
                :compute-slide-label="computePositionLabel"
                @mount="(next: CarouselControls) => (controls = next)"
            >
                <template #renderSlide="{ slide, state }">
                    <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                </template>
            </Carousel>

            <PageCarouselsBar v-if="controls" :controls="controls" has-picks has-rotation />
        </PageCarouselBox>
    </div>
</template>
