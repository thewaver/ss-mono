<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Wheels/OverheadWheelPage/OverheadWheelPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import { useWheelsControls } from "../Wheels.utils";
import PageWheelsPanel from "../WheelsPanel.vue";
import OverheadExampleWrapper from "./OverheadExampleWrapper.vue";

const controls = useWheelsControls();

const targetIndex = shallowRef(0);

const markedIndex = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "overhead",
        name: EXAMPLE_NAMES.overhead,
        readout: () =>
            `under the marker: ${controls.wedges.value[markedIndex.value] ?? "nothing"} — heading for: ${controls.wedges.value[targetIndex.value] ?? "nothing"}`,
        path: `${EXAMPLES_ROOT}/Overhead.vue`,
    },
];
</script>

<template>
    <PageWheelsPanel :controls="controls" />

    <PageExamples :items="examples" layout="flow">
        <template #overhead>
            <OverheadExampleWrapper
                v-bind="controls.sharedProps.value"
                v-model:target-index="targetIndex"
                @selected-wedge-change="(index: number) => (markedIndex = index)"
            />
        </template>
    </PageExamples>
</template>
