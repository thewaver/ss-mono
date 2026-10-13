<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PromptExample from "./Examples/Prompt.vue";

const bought = shallowRef(0);

const visibility = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "prompt",
        name: EXAMPLE_NAMES.prompt,
        readout: () => `bought: ${bought.value} — nothing else on the page answers until you do`,
        path: `${EXAMPLES_ROOT}/Prompt.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #prompt>
            <PromptExample v-model:visibility="visibility" @buy="bought++" />
        </template>
    </PageExamples>
</template>
