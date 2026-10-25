<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
import { toFramedPlacement } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.utils";

import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.vue";
import PageCarouselsBar from "../../PageCarouselsBar.vue";
import type { CarouselLooksDocsExampleProps } from "../CarouselPageVue.types";

const SLIDES = TITLES.slice(0, SLIDE_COUNT);

type Props = CarouselLooksDocsExampleProps;

const props = defineProps<Props>();

const controls = shallowRef<CarouselControls>();

const placementRule = computed(() =>
    CarouselPlacementUtils.toPlacementRule(toFramedPlacement(props.placement, props.orientation)),
);

const frames = computed(() => styles.slideFrames[PLACEMENT_FRAMES[props.placement] ?? "whole"][props.orientation]);
</script>

<template>
    <div :class="styles.docsCarousel">
        <PageCarouselBox>
            <Carousel
                :placement="placementRule"
                :slides="SLIDES"
                :orientation="orientation"
                ariaLabel="Looks"
                :compute-slide-label="computePositionLabel"
                @mount="(next: CarouselControls) => (controls = next)"
            >
                <template #renderSlide="{ slide, state }">
                    <div :class="frames.front">
                        <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                    </div>
                </template>

                <template #renderSlideBack>
                    <div :class="frames.back">
                        <PageCarouselSlideBack />
                    </div>
                </template>
            </Carousel>

            <PageCarouselsBar v-if="controls" :controls="controls" has-picks />
        </PageCarouselBox>
    </div>
</template>
