<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { Color } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DropdownExample from "./Examples/Dropdown.vue";
import SurfaceExample from "./Examples/Surface.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ColorAreaPage/Examples";

const STARTING_HSV: Color.HSVA = { h: 210, s: 70, v: 90, a: 1 };
const STARTING_PICKER_HSV: Color.HSVA = { h: 90, s: 50, v: 80, a: 1 };
const STARTING_DISABLED_HSV: Color.HSVA = { h: 0, s: 60, v: 60, a: 1 };

const popupId = useId();

const bare = shallowRef<Color.HSVA>(STARTING_HSV);
const picker = shallowRef<Color.HSVA>(STARTING_PICKER_HSV);
const disabled = shallowRef<Color.HSVA>(STARTING_DISABLED_HSV);
const isOpen = shallowRef(false);
const hue = shallowRef(STARTING_PICKER_HSV.h);

const examples: ExampleDefs[] = [
    {
        key: "bare",
        name: "The surface alone",
        readout: () =>
            `hsv: ${Math.round(bare.value.h)}° ${Math.round(bare.value.s)}% ${Math.round(bare.value.v)}% — hex: ${Color.HSV.toHex(bare.value)}`,
        path: `${EXAMPLES_ROOT}/Surface.vue`,
    },
    {
        key: "dropdown",
        name: "In a dropdown, replacing the OS dialog",
        readout: () => `${Color.HSVA.toHexa(picker.value)} — open: ${isOpen.value}`,
        path: `${EXAMPLES_ROOT}/Dropdown.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => "the drag is not attached at all, so nothing moves",
        path: `${EXAMPLES_ROOT}/Surface.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #bare>
            <SurfaceExample v-model:hsv="bare" />
        </template>

        <template #dropdown>
            <DropdownExample v-model:hsv="picker" v-model:is-open="isOpen" v-model:hue="hue" :popup-id="popupId" />
        </template>

        <template #disabled>
            <SurfaceExample v-model:hsv="disabled" is-disabled />
        </template>
    </PageExamples>
</template>
