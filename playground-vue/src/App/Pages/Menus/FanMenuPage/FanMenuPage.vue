<script setup lang="ts">
import { shallowRef } from "vue";

import type { MenuItem } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import FanExample from "./Examples/Fan.vue";
import type { FanAction } from "./FanMenuPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Menus/FanMenuPage/Examples";

const NOTHING_RUN = "nothing run yet";

const ACTIONS: MenuItem<FanAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const NESTED_ACTIONS: MenuItem<FanAction>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Dashboard" } }, { value: { name: "Report" } }],
            },
            { value: { name: "Import" } },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    {
        value: { name: "Share" },
        items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

const lastAction = shallowRef(NOTHING_RUN);
const lastNestedAction = shallowRef(NOTHING_RUN);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () =>
            `${lastAction.value} — a narrow arc opening sideways, the shape a combat menu uses: upright labels reading outward from the thing that opened them`,
        path: `${EXAMPLES_ROOT}/Fan.vue`,
    },
    {
        key: "submenus",
        name: "Submenus",
        readout: () =>
            `${lastNestedAction.value} — a level replaces the one before it rather than stacking beside it, and the row at the top is the item you came in through`,
        path: `${EXAMPLES_ROOT}/Fan.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <FanExample caption="Fan" :items="ACTIONS" @activate="(action: FanAction) => (lastAction = action.name)" />
        </template>

        <template #submenus>
            <FanExample
                caption="Fan"
                :items="NESTED_ACTIONS"
                @activate="(action: FanAction) => (lastNestedAction = action.name)"
            />
        </template>
    </PageExamples>
</template>
