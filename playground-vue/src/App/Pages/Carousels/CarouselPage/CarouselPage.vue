<script setup lang="ts">
import { shallowRef } from "vue";

import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.vue";
import { useCarouselsControls } from "../Carousels.utils";
import PageCarouselsPanel from "../PageCarouselsPanel.vue";
import NoControlsExample from "./Examples/NoControls.vue";
import RingExample from "./Examples/Ring.vue";
import RotatingExample from "./Examples/Rotating.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import SteppedExample from "./Examples/Stepped.vue";
import WordDrumExample from "./Examples/WordDrum.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/CarouselPage/Examples";

const controls = useCarouselsControls();

const { isLooping, isDisabled, orientation, sharedProps, delay, slides } = controls;

const manualIndex = shallowRef(0);
const rotatingIndex = shallowRef(0);
const rotatingPlaying = shallowRef(true);
const barelessIndex = shallowRef(0);
const scrolledIndex = shallowRef(0);
const ringIndex = shallowRef(0);
const wordDrumIndex = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "manual",
        name: "Stepped by hand",
        readout: () =>
            `slide ${manualIndex.value + 1} of ${controls.slideCount.value} — ${isLooping.value ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
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
    {
        key: "scrolled",
        name: "Driven by a scroll",
        readout: () =>
            `slide ${scrolledIndex.value + 1} of ${controls.slideCount.value} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
    {
        key: "ring",
        name: "A ring that turns and leans",
        readout: () =>
            `slide ${ringIndex.value + 1} of ${controls.slideCount.value} — the paddle wheel rule, the slides standing round an upright spine with each painting only the half away from it, inside a Tilter, with its progress written on a clock for a continuous turn; Stop is the way to halt it that a turn running on its own owes the reader`,
        path: `${EXAMPLES_ROOT}/Ring.vue`,
    },
    {
        key: "wordDrum",
        name: "A drum of words turned by scrolling",
        readout: () =>
            `word ${wordDrumIndex.value + 1} of ${CarouselKnobs.WORD_DRUM_WORDS.length} — a drum of a fixed number of faces, each a quarter of the box, with a word on each face near the front, its progress written by the box's scroll; scrolling rolls the next word up, and the faces past the first and last word stay empty`,
        path: `${EXAMPLES_ROOT}/WordDrum.vue`,
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

        <template #ring>
            <RingExample
                v-model:index="ringIndex"
                :slides="slides"
                :is-disabled="isDisabled"
                :orientation="orientation"
            />
        </template>

        <template #wordDrum>
            <WordDrumExample v-model:index="wordDrumIndex" :is-disabled="isDisabled" />
        </template>
    </PageExamples>
</template>
