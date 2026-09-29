<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import CopyExample from "./Examples/Copy.vue";
import DecoratedExample from "./Examples/Decorated.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import PendingExample from "./Examples/Pending.vue";
import ReachableExample from "./Examples/Reachable.vue";

const COPY_TEXT = "npm install @thewaver/ss-components";
const EXAMPLES_ROOT = "/src/App/Pages/ButtonPage/Examples";

const clicks = shallowRef(0);
const toggleOn = shallowRef(false);
const disabledClicks = shallowRef(0);
const reachableClicks = shallowRef(0);
const hasError = shallowRef(true);
const saves = shallowRef(0);
const copies = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `clicks: ${clicks.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "decorated",
        name: "Decorated",
        readout: () => `pressed: ${toggleOn.value}`,
        path: `${EXAMPLES_ROOT}/Decorated.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `clicks: ${disabledClicks.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `clicks: ${reachableClicks.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `hasError: ${hasError.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
    {
        key: "pending",
        name: "Pending",
        readout: () =>
            `saves: ${saves.value} — the handler answers with a promise that takes a second, and presses that land before it settles are ignored`,
        path: `${EXAMPLES_ROOT}/Pending.vue`,
    },
    {
        key: "copy",
        name: "Copy to the clipboard",
        readout: () =>
            `copies: ${copies.value} — the handler answers with the clipboard's own promise, so the button is pending while it writes, then says Copied for two seconds and announces it`,
        path: `${EXAMPLES_ROOT}/Copy.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample @click="clicks++" />
        </template>

        <template #decorated>
            <DecoratedExample :is-pressed="toggleOn" @click="toggleOn = !toggleOn" />
        </template>

        <template #disabled>
            <DisabledExample @click="disabledClicks++" />
        </template>

        <template #reachable>
            <ReachableExample @click="reachableClicks++" />
        </template>

        <template #errored>
            <ErroredExample :has-error="hasError" @click="hasError = !hasError" />
        </template>

        <template #pending>
            <PendingExample @click="saves++" />
        </template>

        <template #copy>
            <CopyExample :text="COPY_TEXT" @copy="copies++" />
        </template>
    </PageExamples>
</template>
