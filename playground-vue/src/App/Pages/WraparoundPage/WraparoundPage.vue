<script setup lang="ts">
import { shallowRef } from "vue";

import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import GridExample from "./Examples/Grid.vue";
import MosaicExample from "./Examples/Mosaic.vue";

const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

const mosaicPressed = shallowRef(NOTHING_PRESSED);
const gridPressed = shallowRef(NOTHING_PRESSED);

const examples: ExampleDefs[] = [
    {
        key: "mosaic",
        span: 2,
        name: "A mosaic that never ends",
        readout: () =>
            `opened: ${mosaicPressed.value} — drag and let go to send it coasting, or use the wheel; with the window focused the arrows and page keys move it and Home brings it back, and tabbing into the pictures brings the one focused into view`,
        path: `${EXAMPLES_ROOT}/Mosaic.vue`,
    },
    {
        key: "grid",
        span: 2,
        name: "Content smaller than the window",
        readout: () =>
            `pressed: ${gridPressed.value} — six buttons, copied until the window is full; only one set can be tabbed to or read out, and pressing any copy presses the real button`,
        path: `${EXAMPLES_ROOT}/Grid.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #mosaic>
            <MosaicExample @press="(name: string) => (mosaicPressed = name)" />
        </template>

        <template #grid>
            <GridExample @press="(name: string) => (gridPressed = name)" />
        </template>
    </PageExamples>
</template>
