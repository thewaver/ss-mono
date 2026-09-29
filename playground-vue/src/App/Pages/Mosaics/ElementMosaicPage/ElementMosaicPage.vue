<script setup lang="ts">
import { shallowRef } from "vue";

import { TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import { useMosaicsControls } from "../Mosaics.utils";
import PageMosaicsPanel from "../MosaicsPanel.vue";
import ElementsExampleWrapper from "./ElementsExampleWrapper.vue";
import WalkedExampleWrapper from "./WalkedExampleWrapper.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Mosaics/ElementMosaicPage/Examples";

const controls = useMosaicsControls();

const pickedNames = shallowRef<string[]>([]);

const togglePicked = (index: number) => {
    const name = TILES[index]?.name;

    if (name === undefined) return;

    pickedNames.value = pickedNames.value.includes(name)
        ? pickedNames.value.filter((picked) => picked !== name)
        : [...pickedNames.value, name];
};

const sharedProps = controls.sharedProps;

const examples: ExampleDefs[] = [
    {
        key: "elements",
        name: "Elements the consumer sizes",
        readout: () =>
            "every tile is handed its own width and height, and the arrangement only decides where each one goes",
        path: `${EXAMPLES_ROOT}/Elements.vue`,
    },
    {
        key: "walked",
        name: "One tab stop, walked by the arrow keys",
        readout: () =>
            `${pickedNames.value.length ? `grown: ${pickedNames.value.join(", ")}` : "nothing grown"} — Tab in, then Left and Right follow the reading order, Up and Down go to the tile below or above, and Enter, Space or a press grows or shrinks a tile so the rest re-pack around it`,
        path: `${EXAMPLES_ROOT}/Walked.vue`,
    },
];
</script>

<template>
    <PageMosaicsPanel :controls="controls" />

    <PageExamples :items="examples" layout="flow">
        <template #elements>
            <ElementsExampleWrapper v-bind="sharedProps" />
        </template>

        <template #walked>
            <WalkedExampleWrapper v-bind="sharedProps" :picked-names="pickedNames" @activate="togglePicked" />
        </template>
    </PageExamples>
</template>
