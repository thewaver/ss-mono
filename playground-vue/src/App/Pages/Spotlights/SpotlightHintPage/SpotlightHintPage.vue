<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import HintExample from "./Examples/Hint.vue";

const index = shallowRef(0);

const visibility = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "hint",
        name: EXAMPLE_NAMES.hint,
        readout: () => `open: ${visibility.value} — a click anywhere or any real key puts it away`,
        path: `${EXAMPLES_ROOT}/Hint.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #hint>
            <HintExample
                v-model:visibility="visibility"
                :index="index"
                @index-change="(next: number) => (index = next)"
            />
        </template>
    </PageExamples>
</template>
