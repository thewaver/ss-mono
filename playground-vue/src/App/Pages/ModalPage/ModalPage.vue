<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import DestructiveConfirmationExample from "./Examples/DestructiveConfirmation.vue";
import LayeredExample from "./Examples/Layered.vue";
import TextOnlyExample from "./Examples/TextOnly.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ModalPage/Examples";

const modalVisibility = shallowRef(false);
const destructiveVisibility = shallowRef(false);
const layeredVisibility = shallowRef(false);
const layeredValue = shallowRef<string | undefined>();
const textOnlyVisibility = shallowRef(false);

const outcome = shallowRef("nothing decided yet");

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `open: ${modalVisibility.value} — Escape and an overlay click both dismiss it`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "destructiveConfirmation",
        name: "Destructive confirmation",
        readout: () =>
            `open: ${destructiveVisibility.value} | outcome: ${outcome.value} — the alertdialog role, a required focus target, and neither overlay nor Escape dismissal`,
        path: `${EXAMPLES_ROOT}/DestructiveConfirmation.vue`,
    },
    {
        key: "layered",
        name: "A popup inside it",
        readout: () =>
            `open: ${layeredVisibility.value} | country: ${layeredValue.value ?? "undefined"} — Escape closes the innermost layer only`,
        path: `${EXAMPLES_ROOT}/Layered.vue`,
    },
    {
        key: "textOnly",
        name: "Nothing focusable inside",
        readout: () =>
            `open: ${textOnlyVisibility.value} — with nothing to focus inside, the dialog takes focus itself`,
        path: `${EXAMPLES_ROOT}/TextOnly.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:visibility="modalVisibility" />
        </template>

        <template #destructiveConfirmation>
            <DestructiveConfirmationExample
                v-model:visibility="destructiveVisibility"
                @decide="(next: string) => (outcome = next)"
            />
        </template>

        <template #layered>
            <LayeredExample v-model:visibility="layeredVisibility" v-model:value="layeredValue" />
        </template>

        <template #textOnly>
            <TextOnlyExample v-model:visibility="textOnlyVisibility" />
        </template>
    </PageExamples>
</template>
