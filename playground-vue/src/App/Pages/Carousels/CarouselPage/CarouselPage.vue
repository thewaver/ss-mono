<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import { useCarouselsControls } from "../Carousels.utils";
import PageCarouselsPanel from "../PageCarouselsPanel.vue";
import NoControlsExample from "./Examples/NoControls.vue";
import RotatingExample from "./Examples/Rotating.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import SteppedExample from "./Examples/Stepped.vue";

const controls = useCarouselsControls();

const { isLooping, sharedProps, delay } = controls;

const manualIndex = shallowRef(0);
const rotatingIndex = shallowRef(0);
const rotatingPlaying = shallowRef(true);
const barelessIndex = shallowRef(0);
const scrolledIndex = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "manual",
        name: EXAMPLE_NAMES.manual,
        readout: () =>
            `slide ${manualIndex.value + 1} of ${controls.slideCount.value} — ${isLooping.value ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
        path: `${EXAMPLES_ROOT}/Stepped.vue`,
    },
    {
        key: "rotating",
        name: EXAMPLE_NAMES.rotating,
        readout: () =>
            `slide ${rotatingIndex.value + 1} of ${controls.slideCount.value} | ${rotatingPlaying.value ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping.value ? "" : "; with looping off it stops for good on the last slide"}`,
        path: `${EXAMPLES_ROOT}/Rotating.vue`,
    },
    {
        key: "scrolled",
        name: EXAMPLE_NAMES.scrolled,
        readout: () =>
            `slide ${scrolledIndex.value + 1} of ${controls.slideCount.value} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
    {
        key: "noControls",
        name: EXAMPLE_NAMES.noControls,
        readout: () =>
            `slide ${barelessIndex.value + 1} of ${controls.slideCount.value} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
        path: `${EXAMPLES_ROOT}/NoControls.vue`,
    },
];
</script>

<template>
    <PageCarouselsPanel :controls="controls" has-placement has-delay has-looping />

    <PageExamples :items="examples">
        <template #manual>
            <PageCarouselBox>
                <SteppedExample v-bind="sharedProps" v-model:index="manualIndex" :is-looping="isLooping" />
            </PageCarouselBox>
        </template>

        <template #rotating>
            <PageCarouselBox>
                <RotatingExample
                    v-bind="sharedProps"
                    v-model:index="rotatingIndex"
                    v-model:playback="rotatingPlaying"
                    :is-looping="isLooping"
                    :autoplay-delay-ms="delay"
                />
            </PageCarouselBox>
        </template>

        <template #noControls>
            <PageCarouselBox>
                <NoControlsExample v-bind="sharedProps" v-model:index="barelessIndex" />
            </PageCarouselBox>
        </template>

        <template #scrolled>
            <ScrolledExample v-bind="sharedProps" v-model:index="scrolledIndex" />
        </template>
    </PageExamples>
</template>
