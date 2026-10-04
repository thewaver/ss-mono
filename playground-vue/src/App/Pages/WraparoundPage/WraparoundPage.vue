<script setup lang="ts">
import { shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, WRAPAROUND_DEFAULTS } from "@thewaver/ss-components-vue";
import { WraparoundKnobs } from "@thewaver/ss-playground/App/Knobs/Wraparounds.const";
import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import GridExample from "./Examples/Grid.vue";
import MarqueeExample from "./Examples/Marquee.vue";
import MosaicExample from "./Examples/Mosaic.vue";

const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

const NO_DRIFT_PX_PER_SECOND = 0;

const mosaicPressed = shallowRef(NOTHING_PRESSED);
const gridPressed = shallowRef(NOTHING_PRESSED);
const driftPxPerSecond = shallowRef(WraparoundKnobs.STARTING_DRIFT_PX_PER_SECOND);
const driftDegrees = shallowRef(WRAPAROUND_DEFAULTS.driftDegrees);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isMarqueePlaying = shallowRef(true);

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
    {
        key: "marquee",
        span: 2,
        name: "Marquee",
        readout: () =>
            prefersReducedMotion.value
                ? "reduced motion is on, so the strip stays still"
                : `${isMarqueePlaying.value ? "drifting" : "paused"} — the strip moves by itself and holds while the pointer is over it; Pause stops it, and since it cannot be moved by hand, the wheel over it scrolls the page`,
        path: `${EXAMPLES_ROOT}/Marquee.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="driftPxPerSecond"
            label="Marquee speed (px/s)"
            hint="How far the marquee's strip drifts in a second. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="driftPxPerSecond"
                :min="WraparoundKnobs.MIN_DRIFT_PX_PER_SECOND"
                :max="WraparoundKnobs.MAX_DRIFT_PX_PER_SECOND"
                :step="WraparoundKnobs.DRIFT_STEP_PX_PER_SECOND"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Marquee speed in pixels per second"
                @input="(value: number) => (driftPxPerSecond = value)"
            />
        </PageProp>

        <PageProp
            item-key="driftDegrees"
            label="Marquee direction (°)"
            hint="Which way the marquee's strip drifts: 0 is to the right, 90 down, 180 to the left and 270 up."
        >
            <PageNumberField
                :value="driftDegrees"
                :min="WraparoundKnobs.MIN_DRIFT_DEGREES"
                :max="WraparoundKnobs.MAX_DRIFT_DEGREES"
                :step="WraparoundKnobs.DRIFT_STEP_DEGREES"
                ariaLabel="Marquee direction in degrees"
                @input="(value: number) => (driftDegrees = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #mosaic>
            <MosaicExample @press="(name: string) => (mosaicPressed = name)" />
        </template>

        <template #grid>
            <GridExample @press="(name: string) => (gridPressed = name)" />
        </template>

        <template #marquee>
            <MarqueeExample
                v-model:playback="isMarqueePlaying"
                :drift-px-per-second="prefersReducedMotion ? NO_DRIFT_PX_PER_SECOND : driftPxPerSecond"
                :drift-degrees="driftDegrees"
            />
        </template>
    </PageExamples>
</template>
