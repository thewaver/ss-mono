<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import { useWheelsControls } from "../Wheels.utils";
import PageWheelsPanel from "../WheelsPanel.vue";
import OverExample from "./Examples/Over.vue";
import SidewaysExample from "./Examples/Sideways.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Wheels/DrumWheelPage/Examples";

const controls = useWheelsControls();

const sidewaysIndex = shallowRef(0);
const reelIndex = shallowRef(0);

const sidewaysMarkedIndex = shallowRef(0);
const reelMarkedIndex = shallowRef(0);

const getReadout = (markedIndex: number, settledIndex: number) =>
    `under the marker: ${controls.wedges.value[markedIndex] ?? "nothing"} — settled on: ${controls.wedges.value[settledIndex] ?? "nothing"}`;

const examples: ExampleDefs[] = [
    {
        key: "sideways",
        name: "Turning sideways",
        readout: () => getReadout(sidewaysMarkedIndex.value, sidewaysIndex.value),
        path: `${EXAMPLES_ROOT}/Sideways.vue`,
    },
    {
        key: "reel",
        name: "Turning over",
        readout: () => getReadout(reelMarkedIndex.value, reelIndex.value),
        path: `${EXAMPLES_ROOT}/Over.vue`,
    },
];
</script>

<template>
    <PageWheelsPanel :controls="controls" />

    <PageExamples :items="examples" layout="flow">
        <template #sideways>
            <SidewaysExample
                v-bind="controls.sharedProps.value"
                v-model:target-index="sidewaysIndex"
                @selected-wedge-change="(index: number) => (sidewaysMarkedIndex = index)"
            />
        </template>

        <template #reel>
            <OverExample
                v-bind="controls.sharedProps.value"
                v-model:target-index="reelIndex"
                @selected-wedge-change="(index: number) => (reelMarkedIndex = index)"
            />
        </template>
    </PageExamples>
</template>
