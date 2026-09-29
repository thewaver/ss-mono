<script setup lang="ts">
import { shallowRef } from "vue";

import type { DrawerEdge } from "@thewaver/ss-components-vue";
import { DRAWER_EDGES } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { DrawerExampleProps } from "./DrawerPage.types";
import DefaultExample from "./Examples/Default.vue";

const FILLER_NAMES = ["Alder", "Birch", "Cedar", "Elm", "Hazel", "Larch", "Maple", "Rowan", "Willow", "Yew"];
const FILLER_COUNT = 60;
const EXAMPLES_ROOT = "/src/App/Pages/DrawerPage/Examples";

const FILLERS = Array.from(
    { length: FILLER_COUNT },
    (_, index) => `${FILLER_NAMES[index % FILLER_NAMES.length]} ${index + 1}`,
);

const visibilityByEdge = shallowRef<Partial<Record<DrawerEdge, boolean>>>({});

const getIsVisible = (edge: DrawerEdge) => visibilityByEdge.value[edge] ?? false;

const getCommonProps = (edge: DrawerEdge): DrawerExampleProps => ({
    "edge": edge,
    "fillers": FILLERS,
    "visibility": getIsVisible(edge),
    "onUpdate:visibility": (value) => {
        visibilityByEdge.value = { ...visibilityByEdge.value, [edge]: value };
    },
});

const examples: ExampleDefs[] = DRAWER_EDGES.map((edge) => ({
    key: edge,
    name: `Edge: ${edge}`,
    readout: () => `open: ${getIsVisible(edge)} — the edge is geometry, the slide is paint`,
    path: `${EXAMPLES_ROOT}/Default.vue`,
}));
</script>

<template>
    <PageExamples :items="examples">
        <template v-for="edge in DRAWER_EDGES" :key="edge" #[edge]>
            <DefaultExample v-bind="getCommonProps(edge)" />
        </template>
    </PageExamples>
</template>
