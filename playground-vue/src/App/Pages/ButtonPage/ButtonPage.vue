<script setup lang="ts">
import { shallowRef } from "vue";

import { COPY_TEXT, EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import CopyExample from "./Examples/Copy.vue";
import CounterExample from "./Examples/Counter.vue";
import DecoratedExample from "./Examples/Decorated.vue";
import PendingExample from "./Examples/Pending.vue";

const toggleOn = shallowRef(false);
const saves = shallowRef(0);
const copies = shallowRef(0);
const count = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "decorated",
        name: EXAMPLE_NAMES.decorated,
        readout: () => `pressed: ${toggleOn.value}`,
        path: `${EXAMPLES_ROOT}/Decorated.vue`,
    },
    {
        key: "pending",
        name: EXAMPLE_NAMES.pending,
        readout: () =>
            `saves: ${saves.value} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
        path: `${EXAMPLES_ROOT}/Pending.vue`,
    },
    {
        key: "copy",
        name: EXAMPLE_NAMES.copy,
        readout: () =>
            `copies: ${copies.value} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
        path: `${EXAMPLES_ROOT}/Copy.vue`,
    },
    {
        key: "counter",
        name: EXAMPLE_NAMES.counter,
        readout: () => `count: ${count.value}`,
        path: `${EXAMPLES_ROOT}/Counter.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #decorated>
            <DecoratedExample :is-pressed="toggleOn" @click="toggleOn = !toggleOn" />
        </template>

        <template #pending>
            <PendingExample @click="saves++" />
        </template>

        <template #copy>
            <CopyExample :text="COPY_TEXT" @copy="copies++" />
        </template>

        <template #counter>
            <CounterExample :count="count" @step="(step: number) => (count += step)" />
        </template>
    </PageExamples>
</template>
