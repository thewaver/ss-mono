<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import TextExample from "./Examples/Text.vue";

const EXAMPLES_ROOT = "/src/App/Pages/PreviewPage/Examples";

const COLLAPSED_HEIGHT = 120;

const LONG_PARAGRAPHS = [
    "The keep was built in the spring of 1412 by masons who had never seen the sea, which is why every window on the seaward wall is a hand too narrow.",
    "Its great hall held four hundred at the harvest feast and was heated by a single fire, on the reasoning that four hundred people are themselves a fire of sorts.",
    "The east tower was added a century later, and leans, and has leaned for so long that the town would find it strange upright.",
];

const SHORT_PARAGRAPHS = ["The east tower leans, and has done for four hundred years."];

const isLongExpanded = shallowRef(false);
const isShortExpanded = shallowRef(false);
const isScrolledExpanded = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "long",
        name: "More than fits",
        readout: () => `expanded: ${isLongExpanded.value} — the control appears because there is something behind it`,
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "unheld",
        name: "Nobody holding the state",
        readout: () =>
            "no signal passed — the preview keeps whether it is expanded itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "short",
        name: "Less than fits",
        readout: () =>
            `expanded: ${isShortExpanded.value} — same component, same height, no control and no fade at all`,
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "scrolled",
        name: "Inside a box that scrolls",
        readout: () =>
            `expanded: ${isScrolledExpanded.value} — closing it brings the control back rather than leaving you further down`,
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #long>
            <TextExample
                v-model:expanded="isLongExpanded"
                :collapsed-height="COLLAPSED_HEIGHT"
                :paragraphs="LONG_PARAGRAPHS"
            />
        </template>

        <template #unheld>
            <TextExample :collapsed-height="COLLAPSED_HEIGHT" :paragraphs="LONG_PARAGRAPHS" />
        </template>

        <template #short>
            <TextExample
                v-model:expanded="isShortExpanded"
                :collapsed-height="COLLAPSED_HEIGHT"
                :paragraphs="SHORT_PARAGRAPHS"
            />
        </template>

        <template #scrolled>
            <ScrolledExample
                v-model:expanded="isScrolledExpanded"
                :collapsed-height="COLLAPSED_HEIGHT"
                :paragraphs="LONG_PARAGRAPHS"
            />
        </template>
    </PageExamples>
</template>
