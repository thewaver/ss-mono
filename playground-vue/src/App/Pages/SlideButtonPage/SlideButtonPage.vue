<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    LOCK_COUNT,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ArmingExample from "./Examples/Arming.vue";

const armedCount = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "arming",
        name: EXAMPLE_NAMES.arming,
        readout: () => `armed: ${armedCount.value} of ${LOCK_COUNT}`,
        path: `${EXAMPLES_ROOT}/Arming.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #arming>
            <ArmingExample @armed-count-change="(count: number) => (armedCount = count)" />
        </template>
    </PageExamples>
</template>
