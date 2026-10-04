<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { FLIPBOOK_DEFAULTS, FlipbookUtils, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { FlipbookKnobs } from "@thewaver/ss-playground/App/Knobs/Flipbooks.const";
import { computeFlipbookSpreadAnnouncement } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BookExample from "./Examples/Book.vue";

const NO_MOTION_DURATION_MS = 0;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/FlipbookPage/Examples";

const transitionDurationMs = shallowRef(FLIPBOOK_DEFAULTS.transitionDurationMs);
const index = shallowRef(0);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const turnDurationMs = computed(() =>
    prefersReducedMotion.value ? NO_MOTION_DURATION_MS : transitionDurationMs.value,
);

const examples: ExampleDefs[] = [
    {
        key: "book",
        name: "A book of twelve pages",
        readout: () => {
            const count = FLIPBOOK_PAGES.length;
            const pages = FlipbookUtils.getShowingPages(index.value, count);

            return `open at ${computeFlipbookSpreadAnnouncement(pages, count)} — turn it with the buttons, with the arrow keys while the book has focus, or by dragging a page across`;
        },
        path: `${EXAMPLES_ROOT}/Book.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="transitionDurationMs"
            label="Turn duration (ms)"
            hint="How long one page takes to turn over. It is off while the visitor has asked for reduced motion, and the pages then turn at once."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="FlipbookKnobs.MIN_DURATION_MS"
                :max="FlipbookKnobs.MAX_DURATION_MS"
                :step="FlipbookKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Turn duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #book>
            <BookExample v-model:index="index" :transition-duration-ms="turnDurationMs" />
        </template>
    </PageExamples>
</template>
