<script setup lang="ts">
import { shallowRef } from "vue";

import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-vue";
import type { CarouselControls } from "@thewaver/ss-components-vue";
import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.vue";
import PageCarouselsBar from "../../PageCarouselsBar.vue";

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

const controls = shallowRef<CarouselControls>();
const builtCount = shallowRef(0);
</script>

<template>
    <div :class="styles.docsCarousel">
        <PageCarouselBox>
            <Carousel
                :placement="CarouselPlacementUtils.track"
                :slides="SLIDES"
                is-windowed
                ariaLabel="A hundred slides"
                :compute-slide-label="computePositionLabel"
                @mount="(next: CarouselControls) => (controls = next)"
            >
                <template #renderSlide="{ slide, state }">
                    <PageCarouselSlide :state="state" @vue:mounted="builtCount++" @vue:unmounted="builtCount--">{{
                        slide
                    }}</PageCarouselSlide>
                </template>
            </Carousel>

            <PageCarouselsBar v-if="controls" :controls="controls" />
        </PageCarouselBox>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Built: ${builtCount} of ${WINDOWED_SLIDE_COUNT}` }}
    </div>
</template>
