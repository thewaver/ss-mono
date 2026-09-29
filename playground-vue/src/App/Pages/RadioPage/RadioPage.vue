<script setup lang="ts">
import { shallowRef } from "vue";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import ArcExample from "./Examples/Arc.vue";
import DecoratedExample from "./Examples/Decorated.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import RatingExample from "./Examples/Rating.vue";
import ReachableExample from "./Examples/Reachable.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import SegmentedExample from "./Examples/Segmented.vue";
import type { SizeValue } from "./RadioPage.types";

const STARTING_RATING = 3;
const EXAMPLES_ROOT = "/src/App/Pages/RadioPage/Examples";

const defaultValue = shallowRef<SizeValue | undefined>(undefined);
const rightToLeftValue = shallowRef<SizeValue | undefined>(undefined);
const segmentedValue = shallowRef<SizeValue>("medium");
const ratingValue = shallowRef(STARTING_RATING);
const hoveredRating = shallowRef<number | undefined>(undefined);
const arcValue = shallowRef(STARTING_RATING);
const hoveredArc = shallowRef<number | undefined>(undefined);
const decoratedValue = shallowRef<SizeValue>("medium");
const disabledValue = shallowRef<SizeValue>("small");
const reachableValue = shallowRef<SizeValue>("small");
const erroredValue = shallowRef<SizeValue | undefined>(undefined);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${defaultValue.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "rightToLeft",
        name: "In a right-to-left box",
        readout: () =>
            `value: ${rightToLeftValue.value} — the box around the radios sets dir="rtl", so they run from the right and the left arrow moves on to the next one, while up and down keep their meaning`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "segmented",
        name: "Segmented",
        readout: () => `value: ${segmentedValue.value}`,
        path: `${EXAMPLES_ROOT}/Segmented.vue`,
    },
    {
        key: "rating",
        name: "Rating",
        readout: () => `value: ${ratingValue.value}`,
        path: `${EXAMPLES_ROOT}/Rating.vue`,
    },
    {
        key: "arc",
        name: "Rating, bent into an arc",
        readout: () => `value: ${arcValue.value} — the same radios, placed by a layout instead of laid in a row`,
        path: `${EXAMPLES_ROOT}/Arc.vue`,
    },
    {
        key: "decorated",
        name: "Decorated",
        readout: () => `value: ${decoratedValue.value}`,
        path: `${EXAMPLES_ROOT}/Decorated.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `value: ${disabledValue.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `value: ${reachableValue.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `value: ${erroredValue.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" />
        </template>

        <template #rightToLeft>
            <RightToLeftExample v-model:value="rightToLeftValue" />
        </template>

        <template #segmented>
            <SegmentedExample v-model:value="segmentedValue" />
        </template>

        <template #rating>
            <RatingExample v-model:value="ratingValue" v-model:hovered="hoveredRating" />
        </template>

        <template #arc>
            <ArcExample v-model:value="arcValue" v-model:hovered="hoveredArc" />
        </template>

        <template #decorated>
            <DecoratedExample v-model:value="decoratedValue" />
        </template>

        <template #disabled>
            <DisabledExample v-model:value="disabledValue" />
        </template>

        <template #reachable>
            <ReachableExample v-model:value="reachableValue" />
        </template>

        <template #errored>
            <ErroredExample v-model:value="erroredValue" />
        </template>
    </PageExamples>
</template>
