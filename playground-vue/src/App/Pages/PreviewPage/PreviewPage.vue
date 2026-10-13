<script setup lang="ts">
import { shallowRef } from "vue";

import {
    COLLAPSED_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    LONG_PARAGRAPHS,
    SHORT_PARAGRAPHS,
} from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import TextExample from "./Examples/Text.vue";

const isLongExpanded = shallowRef(false);
const isShortExpanded = shallowRef(false);
const isScrolledExpanded = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "long",
        name: EXAMPLE_NAMES.long,
        readout: () => `expanded: ${isLongExpanded.value} — the control appears because there is something behind it`,
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "unheld",
        name: EXAMPLE_NAMES.unheld,
        readout: () =>
            "no signal passed — the preview keeps whether it is expanded itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "short",
        name: EXAMPLE_NAMES.short,
        readout: () =>
            `expanded: ${isShortExpanded.value} — same component, same height, no control and no fade at all`,
        path: `${EXAMPLES_ROOT}/Text.vue`,
    },
    {
        key: "scrolled",
        name: EXAMPLE_NAMES.scrolled,
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
