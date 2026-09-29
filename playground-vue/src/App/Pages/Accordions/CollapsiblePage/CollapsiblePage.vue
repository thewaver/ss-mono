<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import FilledExample from "./Examples/Filled.vue";
import PanelExample from "./Examples/Panel.vue";
import SidewaysExample from "./Examples/Sideways.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Examples";

const panel = shallowRef(false);
const filled = shallowRef(false);
const sideways = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "panel",
        name: "A single panel, no heading",
        readout: () =>
            `expanded: ${panel.value} — one trigger and one panel, with none of the group behavior an accordion adds`,
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "unheld",
        name: "Nobody holding the state",
        readout: () =>
            "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "filled",
        name: "Filling its container, built on first open",
        readout: () =>
            `expanded: ${filled.value} — the panel's contents are not built until it is opened, and are kept once they are`,
        path: `${EXAMPLES_ROOT}/Filled.vue`,
    },
    {
        key: "sideways",
        name: "Opening to the side",
        readout: () =>
            `expanded: ${sideways.value} — the panel grows its width instead of its height, and its contents keep theirs`,
        path: `${EXAMPLES_ROOT}/Sideways.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #panel>
            <PanelExample v-model:expanded="panel" />
        </template>

        <template #unheld>
            <PanelExample />
        </template>

        <template #filled>
            <FilledExample v-model:expanded="filled" />
        </template>

        <template #sideways>
            <SidewaysExample v-model:expanded="sideways" />
        </template>
    </PageExamples>
</template>
