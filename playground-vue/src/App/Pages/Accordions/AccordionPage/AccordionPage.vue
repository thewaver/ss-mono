<script setup lang="ts">
import { shallowRef } from "vue";

import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    STARTING_EXTRA_LINES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DeferredExample from "./Examples/Deferred.vue";
import GrowingExample from "./Examples/Growing.vue";
import RowExample from "./Examples/Row.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import SectionsExample from "./Examples/Sections.vue";

const gap = shallowRef(AccordionKnobs.STARTING_GAP);
const transitionDurationMs = shallowRef(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

const multi = shallowRef<string[]>(["Shipping"]);
const single = shallowRef<string[]>([]);
const required = shallowRef<string[]>(["Shipping"]);
const growing = shallowRef<string[]>(["Shipping"]);
const scrolled = shallowRef<string[]>([]);
const deferred = shallowRef<string[]>([]);
const row = shallowRef<string[]>(["Mountains"]);

const extraLines = shallowRef(STARTING_EXTRA_LINES);
const built = shallowRef<string[]>([]);

const build = (value: string) => {
    if (built.value.includes(value)) return;

    built.value = [...built.value, value];
};

const examples: ExampleDefs[] = [
    {
        key: "multi",
        name: EXAMPLE_NAMES.multi,
        readout: () => `expanded: ${JSON.stringify(multi.value)}`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "unheld",
        name: EXAMPLE_NAMES.unheld,
        readout: () =>
            "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "single",
        name: EXAMPLE_NAMES.single,
        readout: () => `expanded: ${JSON.stringify(single.value)} — the component keeps at most one`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "required",
        name: EXAMPLE_NAMES.required,
        readout: () =>
            `expanded: ${JSON.stringify(required.value)} — pressing the open header does nothing, because the only way out of a section is into another one`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "growing",
        name: EXAMPLE_NAMES.growing,
        readout: () => `extra lines: ${extraLines.value} — the panel follows its content without reopening`,
        path: `${EXAMPLES_ROOT}/Growing.vue`,
    },
    {
        key: "deferred",
        name: EXAMPLE_NAMES.deferred,
        readout: () =>
            `built: ${JSON.stringify(built.value)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
        path: `${EXAMPLES_ROOT}/Deferred.vue`,
    },
    {
        key: "scrolled",
        name: EXAMPLE_NAMES.scrolled,
        readout: () => `expanded: ${JSON.stringify(scrolled.value)} — opening a section below the fold brings it up`,
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
    {
        key: "row",
        name: EXAMPLE_NAMES.row,
        span: 2,
        readout: () =>
            `expanded: ${JSON.stringify(row.value)} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="gap" label="Gap (px)" hint="The space between sections.">
            <PageNumberField
                :value="gap"
                :min="AccordionKnobs.MIN_GAP"
                :max="AccordionKnobs.MAX_GAP"
                :step="AccordionKnobs.GAP_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Gap in pixels"
                @input="(value: number) => (gap = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Transition duration (ms)"
            hint="How long a section takes to open and close. At 0 it opens and closes at once."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="AccordionKnobs.MIN_TRANSITION_MS"
                :max="AccordionKnobs.MAX_TRANSITION_MS"
                :step="AccordionKnobs.TRANSITION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Transition duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #multi>
            <SectionsExample :gap="gap" :transition-duration-ms="transitionDurationMs" v-model:expanded="multi" />
        </template>

        <template #unheld>
            <SectionsExample :gap="gap" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #single>
            <SectionsExample
                :gap="gap"
                :transition-duration-ms="transitionDurationMs"
                v-model:expanded="single"
                is-single-expand
            />
        </template>

        <template #required>
            <SectionsExample
                :gap="gap"
                :transition-duration-ms="transitionDurationMs"
                v-model:expanded="required"
                is-single-expand
                is-expand-required
            />
        </template>

        <template #growing>
            <GrowingExample
                :gap="gap"
                :transition-duration-ms="transitionDurationMs"
                v-model:expanded="growing"
                :extra-lines="extraLines"
                @add-line="extraLines++"
                @clear-lines="extraLines = STARTING_EXTRA_LINES"
            />
        </template>

        <template #deferred>
            <DeferredExample
                :gap="gap"
                :transition-duration-ms="transitionDurationMs"
                v-model:expanded="deferred"
                @build="build"
            />
        </template>

        <template #scrolled>
            <ScrolledExample :gap="gap" :transition-duration-ms="transitionDurationMs" v-model:expanded="scrolled" />
        </template>

        <template #row>
            <RowExample :gap="gap" :transition-duration-ms="transitionDurationMs" v-model:expanded="row" />
        </template>
    </PageExamples>
</template>
