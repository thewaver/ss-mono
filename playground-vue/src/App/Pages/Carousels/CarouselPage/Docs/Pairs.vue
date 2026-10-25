<script setup lang="ts">
import { shallowRef } from "vue";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import {
    computeGroupPositionLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { PAIRED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { computePairs } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselsBar from "../../PageCarouselsBar.vue";

const SLIDES = TITLES.slice(0, PAIRED_SLIDE_COUNT);

const controls = shallowRef<CarouselControls>();
</script>

<template>
    <div :class="styles.docsCarousel">
        <PageCarouselBox>
            <Carousel
                :placement="CarouselPlacementUtils.track"
                :slides="SLIDES"
                ariaLabel="Pairs"
                :compute-slide-label="computePositionLabel"
                :compute-groups="computePairs"
                :compute-group-label="computeGroupPositionLabel"
                @mount="(next: CarouselControls) => (controls = next)"
            >
                <template #renderSlide="{ slide, state }">
                    <PageCarouselSlide :state="state">{{ slide }}</PageCarouselSlide>
                </template>
            </Carousel>

            <PageCarouselsBar v-if="controls" :controls="controls" has-picks />
        </PageCarouselBox>
    </div>
</template>
