<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { CarouselAxis } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import { useCarouselsControls } from "../Carousels.utils";
import PageCarouselsPanel from "../PageCarouselsPanel.vue";
import NoControlsExample from "./Examples/NoControls.vue";
import RotatingExample from "./Examples/Rotating.vue";
import SteppedExample from "./Examples/Stepped.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/DrumCarouselPage/Examples";

const controls = useCarouselsControls();

const { slides, isDisabled, delay } = controls;

const axis = computed<CarouselAxis>(() => (controls.orientation.value === "horizontal" ? "row" : "column"));

const steppedIndex = shallowRef(0);
const rotatingIndex = shallowRef(0);
const rotatingPlaying = shallowRef(true);
const barelessIndex = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "stepped",
        name: "Stepped by hand",
        readout: () =>
            `slide ${steppedIndex.value + 1} of ${controls.slideCount.value} — the slides sit on the faces of a drum, turning about the axis the direction names and swiped along it`,
        path: `${EXAMPLES_ROOT}/Stepped.vue`,
    },
    {
        key: "rotating",
        name: "Rotating on its own",
        readout: () =>
            `slide ${rotatingIndex.value + 1} of ${controls.slideCount.value} | ${rotatingPlaying.value ? "playing" : "stopped"} — the barrel turns itself, and holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background`,
        path: `${EXAMPLES_ROOT}/Rotating.vue`,
    },
    {
        key: "noControls",
        name: "No controls at all",
        readout: () =>
            `slide ${barelessIndex.value + 1} of ${controls.slideCount.value} — nothing is drawn beside the drum, so the surrounding page owns the buttons through the signal it shares`,
        path: `${EXAMPLES_ROOT}/NoControls.vue`,
    },
];
</script>

<template>
    <PageCarouselsPanel :controls="controls" has-delay />

    <PageExamples :items="examples">
        <template #stepped>
            <PageCarouselBox>
                <SteppedExample v-model:index="steppedIndex" :slides="slides" :is-disabled="isDisabled" :axis="axis" />
            </PageCarouselBox>
        </template>

        <template #rotating>
            <PageCarouselBox>
                <RotatingExample
                    v-model:index="rotatingIndex"
                    v-model:playback="rotatingPlaying"
                    :slides="slides"
                    :is-disabled="isDisabled"
                    :autoplay-delay-ms="delay"
                    :axis="axis"
                />
            </PageCarouselBox>
        </template>

        <template #noControls>
            <PageCarouselBox>
                <NoControlsExample
                    v-model:index="barelessIndex"
                    :slides="slides"
                    :is-disabled="isDisabled"
                    :axis="axis"
                />
            </PageCarouselBox>
        </template>
    </PageExamples>
</template>
