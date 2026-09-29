<script setup lang="ts">
import { shallowRef } from "vue";

import type { WheelMenuItem } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import WheelExample from "./Examples/Wheel.vue";
import type { WheelAction } from "./WheelMenuPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Menus/WheelMenuPage/Examples";
const HALF_TURN_DEGREES = 180;

const NOTHING_RUN = "nothing run yet";

const ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Cut", shortcut: "Ctrl+X" } },
    { value: { name: "Copy", shortcut: "Ctrl+C" } },
    { value: { name: "Paste", shortcut: "Ctrl+V" } },
    { value: { name: "Duplicate" } },
    { value: { name: "Delete", shortcut: "Del" } },
];

const NESTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
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

const WEIGHTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
    { value: { name: "Confirm" }, arcDegrees: 180 },
    { value: { name: "Cancel" } },
    { value: { name: "Later" } },
    { value: { name: "Help" } },
];

const lastAction = shallowRef(NOTHING_RUN);
const lastHalfAction = shallowRef(NOTHING_RUN);
const lastNestedAction = shallowRef(NOTHING_RUN);
const lastHalfNestedAction = shallowRef(NOTHING_RUN);
const lastTunedAction = shallowRef(NOTHING_RUN);
const lastWeightedAction = shallowRef(NOTHING_RUN);
const lastFlickedAction = shallowRef(NOTHING_RUN);

const examples: ExampleDefs[] = [
    {
        key: "wheel",
        name: "Whole wheel",
        readout: () =>
            `${lastAction.value} — the items are wedges of a hollow wheel, picked by the direction they lie in, with an ✕ in the hole that closes it`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "half",
        name: "Half wheel",
        readout: () =>
            `${lastHalfAction.value} — the same component over half a turn, on a wider hole because half a turn leaves each wedge half the room`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "concentric",
        name: "Concentric bands",
        readout: () =>
            `${lastNestedAction.value} — a submenu is a band round the same center, aimed at the wedge that opened it and only as wide as its own items need`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "concentricHalves",
        name: "Concentric halves",
        readout: () =>
            `${lastHalfNestedAction.value} — the same nesting on half a wheel, shifted to stay in the upper half`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "weighted",
        name: "A wedge that asks for room",
        readout: () =>
            `${lastWeightedAction.value} — Confirm asks for half the turn and the other three share what is left`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "flick",
        name: "Hold and flick",
        readout: () =>
            `${lastFlickedAction.value} — press and hold the button, move a short way toward a wedge and let go; coming back to the middle before letting go picks nothing, and a plain click leaves the wheel open to be clicked through instead`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
    {
        key: "tuned",
        name: "Tuned",
        readout: () => `${lastTunedAction.value} — the same wheel with a fatter band and wider gaps between the wedges`,
        path: `${EXAMPLES_ROOT}/Wheel.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #wheel>
            <WheelExample
                caption="Wheel"
                :items="ACTIONS"
                @activate="(action: WheelAction) => (lastAction = action.name)"
            />
        </template>

        <template #half>
            <WheelExample
                caption="Half"
                :items="ACTIONS"
                :spread-degrees="HALF_TURN_DEGREES"
                @activate="(action: WheelAction) => (lastHalfAction = action.name)"
            />
        </template>

        <template #concentric>
            <WheelExample
                caption="Wheel"
                :items="NESTED_ACTIONS"
                @activate="(action: WheelAction) => (lastNestedAction = action.name)"
            />
        </template>

        <template #concentricHalves>
            <WheelExample
                caption="Half"
                :items="NESTED_ACTIONS"
                :spread-degrees="HALF_TURN_DEGREES"
                @activate="(action: WheelAction) => (lastHalfNestedAction = action.name)"
            />
        </template>

        <template #weighted>
            <WheelExample
                caption="Wheel"
                :items="WEIGHTED_ACTIONS"
                @activate="(action: WheelAction) => (lastWeightedAction = action.name)"
            />
        </template>

        <template #flick>
            <WheelExample
                caption="Hold"
                :items="ACTIONS"
                opens-on-hold
                @activate="(action: WheelAction) => (lastFlickedAction = action.name)"
            />
        </template>

        <template #tuned>
            <WheelExample
                caption="Wheel"
                :items="ACTIONS"
                :hole-radius="64"
                :band-width="120"
                :layout-defs="{ wedgeGapDegrees: 10 }"
                @activate="(action: WheelAction) => (lastTunedAction = action.name)"
            />
        </template>
    </PageExamples>
</template>
