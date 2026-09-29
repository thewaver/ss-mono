<script setup lang="ts">
import { shallowRef } from "vue";

import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import { useCarouselsControls } from "../Carousels.utils";
import PageCarouselsPanel from "../PageCarouselsPanel.vue";
import NoControlsExample from "./Examples/NoControls.vue";
import RotatingExample from "./Examples/Rotating.vue";
import SteppedExample from "./Examples/Stepped.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/TrackCarouselPage/Examples";

const controls = useCarouselsControls();

const { isLooping, sharedProps, delay } = controls;

const manualIndex = shallowRef(0);
const rotatingIndex = shallowRef(0);
const rotatingPlaying = shallowRef(true);
const barelessIndex = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "manual",
        name: "Stepped by hand",
        readout: () =>
            `slide ${manualIndex.value + 1} of ${controls.slideCount.value} — ${isLooping.value ? "stepping past either end wraps round, which is what separates this from the scroller" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; a column takes its height from the box the page puts round it`,
        path: `${EXAMPLES_ROOT}/Stepped.vue`,
    },
    {
        key: "rotating",
        name: "Rotating on its own",
        readout: () =>
            `slide ${rotatingIndex.value + 1} of ${controls.slideCount.value} | ${rotatingPlaying.value ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping.value ? "" : "; with looping off it stops for good on the last slide"}`,
        path: `${EXAMPLES_ROOT}/Rotating.vue`,
    },
    {
        key: "noControls",
        name: "No controls at all",
        readout: () =>
            `slide ${barelessIndex.value + 1} of ${controls.slideCount.value} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
        path: `${EXAMPLES_ROOT}/NoControls.vue`,
    },
];
</script>

<template>
    <PageCarouselsPanel :controls="controls" has-delay has-looping />

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
    </PageExamples>
</template>
