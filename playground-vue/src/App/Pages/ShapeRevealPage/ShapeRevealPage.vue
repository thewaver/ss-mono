<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, SHAPE_REVEAL_DEFAULTS, ShapeRevealUtils } from "@thewaver/ss-components-vue";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import {
    ORIGIN_LABELS,
    computeShapeRevealReadout,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import type {
    ShapeRevealPageOrigin,
    ShapeRevealPageShape,
    ShapeRevealRun,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import SwitchExample from "./Examples/Switch.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ShapeRevealPage/Examples";
const FIELD_WIDTH = 110;
const SELECT_FIELD_WIDTH = 190;

const NO_MOTION_DURATION_MS = 0;

const shape = shallowRef<ShapeRevealPageShape>(ShapeRevealKnobs.STARTING_SHAPE);
const origin = shallowRef<ShapeRevealPageOrigin>(ShapeRevealKnobs.STARTING_ORIGIN);
const durationMs = shallowRef(SHAPE_REVEAL_DEFAULTS.durationMs);
const blur = shallowRef(SHAPE_REVEAL_DEFAULTS.blur);
const run = shallowRef<ShapeRevealRun>();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const shownDurationMs = computed(() => (prefersReducedMotion.value ? NO_MOTION_DURATION_MS : durationMs.value));

const computeOriginLabel = (value: ShapeRevealPageOrigin) => ORIGIN_LABELS[value];

const examples: ExampleDefs[] = [
    {
        key: "switch",
        name: "A panel switched",
        readout: () => computeShapeRevealReadout(run.value, ShapeRevealUtils.getIsSupported()),
        path: `${EXAMPLES_ROOT}/Switch.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="computePoints"
            label="Shape"
            hint="The contour the new page is uncovered through. Every one grows until it covers the whole window."
        >
            <PageSelectField
                :value="shape"
                :values="ShapeRevealKnobs.SHAPES"
                :width="SELECT_FIELD_WIDTH"
                ariaLabel="Shape"
                @change="(next: ShapeRevealPageShape) => (shape = next)"
            />
        </PageProp>

        <PageProp
            item-key="origin"
            label="Grows from"
            hint="Where the shape starts: the Switch button, the middle of the window, or one of its corners."
        >
            <PageSelectField
                :value="origin"
                :values="ShapeRevealKnobs.ORIGINS"
                :compute-label="computeOriginLabel"
                :width="SELECT_FIELD_WIDTH"
                ariaLabel="Grows from"
                @change="(next: ShapeRevealPageOrigin) => (origin = next)"
            />
        </PageProp>

        <PageProp
            item-key="durationMs"
            label="Duration (ms)"
            hint="How long the shape takes to cover the window. It is off while the visitor has asked for reduced motion, and the panel then simply switches."
        >
            <PageNumberField
                :value="durationMs"
                :min="ShapeRevealKnobs.MIN_DURATION_MS"
                :max="ShapeRevealKnobs.MAX_DURATION_MS"
                :step="ShapeRevealKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Duration in milliseconds"
                @input="(value: number) => (durationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="blur"
            label="Blur (px)"
            hint="How soft the shape's edge is by the time it covers the window. 0 gives a hard edge."
        >
            <PageNumberField
                :value="blur"
                :min="ShapeRevealKnobs.MIN_BLUR"
                :max="ShapeRevealKnobs.MAX_BLUR"
                :step="ShapeRevealKnobs.BLUR_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Blur in pixels"
                @input="(value: number) => (blur = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #switch>
            <SwitchExample
                :shape="shape"
                :origin="origin"
                :duration-ms="shownDurationMs"
                :blur="blur"
                @run="(next: ShapeRevealRun) => (run = next)"
            />
        </template>
    </PageExamples>
</template>
