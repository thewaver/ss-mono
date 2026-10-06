<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import CountriesExample from "./Examples/Countries.vue";
import GlideExample from "./Examples/Glide.vue";
import GroupedExample from "./Examples/Grouped.vue";
import SizesExample from "./Examples/Sizes.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ListboxPage/Examples";

const single = shallowRef<string | undefined>("Portugal");
const multiple = shallowRef<string[]>(["Denmark"]);
const size = shallowRef<string | undefined>();
const glide = shallowRef<string | undefined>("Portugal");

const examples: ExampleDefs[] = [
    {
        key: "single",
        name: "One value",
        readout: () =>
            `value: ${single.value ?? "undefined"} — one tab stop; the arrows move focus between options and stop on Denmark and Finland, which hover explains`,
        path: `${EXAMPLES_ROOT}/Countries.vue`,
    },
    {
        key: "multiple",
        name: "Several values, in groups",
        readout: () =>
            `values: [${multiple.value.join(", ")}] — Enter or Space picks and drops, the arrows skip Finland and cross groups`,
        path: `${EXAMPLES_ROOT}/Grouped.vue`,
    },
    {
        key: "horizontalRightToLeft",
        name: "Horizontal, right to left",
        readout: () =>
            `value: ${size.value ?? "undefined"} — the left arrow moves forward in a right-to-left page, and L is skipped`,
        path: `${EXAMPLES_ROOT}/Sizes.vue`,
    },
    {
        key: "glide",
        name: "Gliding markers",
        readout: () =>
            `value: ${glide.value ?? "undefined"} — one tinted marker sits on the picked option and a second glides to whichever option the pointer or the arrows are on`,
        path: `${EXAMPLES_ROOT}/Glide.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #single>
            <CountriesExample v-model:value="single" />
        </template>

        <template #multiple>
            <GroupedExample v-model:values="multiple" />
        </template>

        <template #horizontalRightToLeft>
            <SizesExample v-model:value="size" />
        </template>

        <template #glide>
            <GlideExample v-model:value="glide" />
        </template>
    </PageExamples>
</template>
