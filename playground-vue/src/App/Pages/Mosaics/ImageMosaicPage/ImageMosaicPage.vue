<script setup lang="ts">
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import { useMosaicsControls } from "../Mosaics.utils";
import PageMosaicsPanel from "../MosaicsPanel.vue";
import ImagesExampleWrapper from "./ImagesExampleWrapper.vue";

const controls = useMosaicsControls();

const sharedProps = controls.sharedProps;

const examples: ExampleDefs[] = [
    {
        key: "images",
        name: EXAMPLE_NAMES.images,
        readout: () =>
            "each row is scaled to fill the fixed side exactly, so the only size asked for is the shape the finished mosaic should come out closest to",
        path: `${EXAMPLES_ROOT}/Images.vue`,
    },
];
</script>

<template>
    <PageMosaicsPanel :controls="controls" />

    <PageExamples :items="examples" layout="flow">
        <template #images>
            <ImagesExampleWrapper v-bind="sharedProps" />
        </template>
    </PageExamples>
</template>
