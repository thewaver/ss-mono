<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DecoratedExample from "./Examples/Decorated.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import MixedExample from "./Examples/Mixed.vue";
import ReachableExample from "./Examples/Reachable.vue";
import RefusedWriteExample from "./Examples/RefusedWrite.vue";

const EXAMPLES_ROOT = "/src/App/Pages/CheckboxPage/Examples";

const defaultChecked = shallowRef(false);
const decoratedChecked = shallowRef(true);
const disabledChecked = shallowRef(true);
const reachableChecked = shallowRef(true);
const erroredChecked = shallowRef(false);

const all = shallowRef(false);
const firstChild = shallowRef(true);
const secondChild = shallowRef(false);

const email = shallowRef(true);
const sms = shallowRef(false);

const isAllMixed = computed(() => firstChild.value !== secondChild.value);

watch(
    [firstChild, secondChild],
    ([isFirstChecked, isSecondChecked]) => {
        all.value = isFirstChecked && isSecondChecked;
    },
    { immediate: true },
);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `checked: ${defaultChecked.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "decorated",
        name: "Decorated",
        readout: () => `checked: ${decoratedChecked.value}`,
        path: `${EXAMPLES_ROOT}/Decorated.vue`,
    },
    {
        key: "mixed",
        name: "Mixed",
        readout: () =>
            `mixed: ${isAllMixed.value} | all: ${all.value} | children: ${firstChild.value}, ${secondChild.value}`,
        path: `${EXAMPLES_ROOT}/Mixed.vue`,
    },
    {
        key: "refusedWrite",
        name: "Refused write",
        readout: () => `email: ${email.value} | sms: ${sms.value} — whichever is the last one on refuses to go off`,
        path: `${EXAMPLES_ROOT}/RefusedWrite.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `checked: ${disabledChecked.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `checked: ${reachableChecked.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `checked: ${erroredChecked.value}`,
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
                v-model:all="all"
                v-model:first-child="firstChild"
                v-model:second-child="secondChild"
                :is-mixed="isAllMixed"
            />
        </template>

        <template #refusedWrite>
            <RefusedWriteExample v-model:email="email" v-model:sms="sms" />
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
