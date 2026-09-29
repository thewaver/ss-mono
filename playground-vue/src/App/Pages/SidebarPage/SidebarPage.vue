<script setup lang="ts">
import { ref } from "vue";

import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SidebarPage/Examples";

const VARIANTS: {
    key: string;
    name: string;
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    note: string;
}[] = [
    {
        key: "push",
        name: "Pushing its neighbor",
        edge: "left",
        layout: "push",
        isExpandedOnHover: false,
        note: "the content beside it narrows as it grows",
    },
    {
        key: "overlay",
        name: "Over its neighbor, from the right",
        edge: "right",
        layout: "overlay",
        isExpandedOnHover: false,
        note: "it only ever takes its collapsed width, and grows over the content",
    },
    {
        key: "hover",
        name: "Expanding on hover",
        edge: "left",
        layout: "overlay",
        isExpandedOnHover: true,
        note: "resting on it expands it without touching the state; the button still pins it open",
    },
];

const expandedByKey = ref<Record<string, boolean>>(Object.fromEntries(VARIANTS.map((variant) => [variant.key, false])));

const examples: ExampleDefs[] = VARIANTS.map((variant) => ({
    key: variant.key,
    name: variant.name,
    readout: () => `expanded: ${expandedByKey.value[variant.key]} — ${variant.note}`,
    path: `${EXAMPLES_ROOT}/Default.vue`,
}));
</script>

<template>
    <PageExamples :items="examples">
        <template v-for="variant in VARIANTS" #[variant.key]>
            <DefaultExample
                :edge="variant.edge"
                :layout="variant.layout"
                :is-expanded-on-hover="variant.isExpandedOnHover"
                v-model:expanded="expandedByKey[variant.key]"
            />
        </template>
    </PageExamples>
</template>
