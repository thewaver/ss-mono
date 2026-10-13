<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DecoratedExample from "./Examples/Decorated.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import MixedExample from "./Examples/Mixed.vue";
import ReachableExample from "./Examples/Reachable.vue";

const defaultChecked = shallowRef(false);
const decoratedChecked = shallowRef(true);
const disabledChecked = shallowRef(true);
const reachableChecked = shallowRef(true);
const erroredChecked = shallowRef(false);

const allChecked = shallowRef(false);
const firstChildChecked = shallowRef(true);
const secondChildChecked = shallowRef(false);

const isAllMixed = computed(() => firstChildChecked.value !== secondChildChecked.value);

watch(
    [firstChildChecked, secondChildChecked],
    ([first, second]) => {
        allChecked.value = first && second;
    },
    { immediate: true },
);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () => `on: ${defaultChecked.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "decorated",
        name: EXAMPLE_NAMES.decorated,
        readout: () => `on: ${decoratedChecked.value}`,
        path: `${EXAMPLES_ROOT}/Decorated.vue`,
    },
    {
        key: "mixed",
        name: EXAMPLE_NAMES.mixed,
        readout: () =>
            `mixed: ${isAllMixed.value} | all: ${allChecked.value} | children: ${firstChildChecked.value}, ${secondChildChecked.value}`,
        path: `${EXAMPLES_ROOT}/Mixed.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () => `on: ${disabledChecked.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: EXAMPLE_NAMES.reachable,
        readout: () => `on: ${reachableChecked.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: EXAMPLE_NAMES.errored,
        readout: () => `on: ${erroredChecked.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:checked="defaultChecked" />
        </template>

        <template #decorated>
            <DecoratedExample v-model:checked="decoratedChecked" />
        </template>

        <template #mixed>
            <MixedExample
                v-model:all="allChecked"
                v-model:first-child="firstChildChecked"
                v-model:second-child="secondChildChecked"
                :is-mixed="isAllMixed"
            />
        </template>

        <template #disabled>
            <DisabledExample v-model:checked="disabledChecked" />
        </template>

        <template #reachable>
            <ReachableExample v-model:checked="reachableChecked" />
        </template>

        <template #errored>
            <ErroredExample v-model:checked="erroredChecked" />
        </template>
    </PageExamples>
</template>
