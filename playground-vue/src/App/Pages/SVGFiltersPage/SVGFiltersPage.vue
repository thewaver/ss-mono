<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefs } from "@thewaver/ss-components-vue";
import type { SVGFilterMethod, SortableItem } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";
import { APPLIED_STEPS } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import { SUBJECT_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BlurExample from "./Examples/Blur.vue";
import DropShadowExample from "./Examples/DropShadow.vue";
import HueExample from "./Examples/Hue.vue";
import StackExample from "./Examples/Stack.vue";
import ToneExample from "./Examples/Tone.vue";
import TurbulenceExample from "./Examples/Turbulence.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/SVGFiltersPage/Examples";

const names = (items: SortableItem<SVGFiltersStep>[]) => items.map((item) => item.value.name).join(" → ") || "nothing";

const method = shallowRef<SVGFilterMethod>(SVGFilterKnobs.STARTING_METHOD);
const isSizedFromElement = shallowRef(SVGFilterKnobs.STARTING_IS_SIZED_FROM_ELEMENT);

const applied = shallowRef<SortableItem<SVGFiltersStep>[]>(APPLIED_STEPS);
const unused = shallowRef<SortableItem<SVGFiltersStep>[]>([]);

const elementSize = computed(() => (isSizedFromElement.value ? SUBJECT_SIZE : undefined));

const commonProps = computed<SVGFiltersExampleProps>(() => ({
    method: method.value,
    elementSize: elementSize.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "blur",
        name: "Blur",
        path: `${EXAMPLES_ROOT}/Blur.vue`,
    },
    {
        key: "dropShadow",
        name: "Drop shadow",
        path: `${EXAMPLES_ROOT}/DropShadow.vue`,
    },
    {
        key: "turbulence",
        name: "Turbulence",
        path: `${EXAMPLES_ROOT}/Turbulence.vue`,
    },
    {
        key: "hue",
        name: "Hue",
        path: `${EXAMPLES_ROOT}/Hue.vue`,
    },
    {
        key: "tone",
        name: "Tone",
        path: `${EXAMPLES_ROOT}/Tone.vue`,
    },
    {
        key: "stack",
        name: "Four at once",
        readout: () =>
            method.value === "chain"
                ? `${names(applied.value)} — chained, so each one is handed what the one before it produced and the order is the effect`
                : `${names(applied.value)} — isolated, so every one reads the original and the order only decides what sits on top`,
        path: `${EXAMPLES_ROOT}/Stack.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="method"
            label="Method"
            hint="Whether each step is fed the result of the one before it, or each works from the original and the results are combined."
        >
            <PageSelectField
                :value="method"
                :values="SVGFilterDefs.METHODS"
                ariaLabel="Method"
                @change="(value: SVGFilterMethod) => (method = value)"
            />
        </PageProp>

        <PageProp
            item-key="elementSize"
            label="Region sized from the element"
            hint="Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region."
        >
            <PageCheckField
                :value="isSizedFromElement"
                ariaLabel="Region sized from the element"
                @change="(value: boolean) => (isSizedFromElement = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #blur>
            <BlurExample v-bind="commonProps" />
        </template>

        <template #dropShadow>
            <DropShadowExample v-bind="commonProps" />
        </template>

        <template #turbulence>
            <TurbulenceExample v-bind="commonProps" />
        </template>

        <template #hue>
            <HueExample v-bind="commonProps" />
        </template>

        <template #tone>
            <ToneExample v-bind="commonProps" />
        </template>

        <template #stack>
            <StackExample v-bind="commonProps" v-model:applied="applied" v-model:unused="unused" />
        </template>
    </PageExamples>
</template>
