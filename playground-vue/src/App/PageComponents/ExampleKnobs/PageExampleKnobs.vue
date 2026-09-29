<script setup lang="ts">
import { onBeforeUnmount, useSlots } from "vue";

import PagePropsPanel from "../PropsPanel/PagePropsPanel.vue";
import { useExampleKnobsContext } from "./ExampleKnobs.context";

const slots = useSlots();

const exampleKnobs = useExampleKnobsContext();

exampleKnobs?.setRenderKnobs(() => slots.default?.());

onBeforeUnmount(() => {
    exampleKnobs?.setRenderKnobs(undefined);
});
</script>

<template>
    <PagePropsPanel v-if="!exampleKnobs" scope="local"><slot /></PagePropsPanel>
</template>
