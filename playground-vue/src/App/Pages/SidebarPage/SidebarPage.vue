<script setup lang="ts">
import { ref } from "vue";

import { EXAMPLES_ROOT, VARIANTS } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";

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
