<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { CuboidController } from "@thewaver/ss-components-vue";
import { CUBOID_DEFAULTS, CuboidUtils, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import UprightExampleWrapper from "./UprightExampleWrapper.vue";
import WanderingExampleWrapper from "./WanderingExampleWrapper.vue";

const NO_MOTION_DURATION_MS = 0;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/CuboidPage/Examples";

const width = shallowRef(CuboidKnobs.STARTING_WIDTH);
const height = shallowRef(CuboidKnobs.STARTING_HEIGHT);
const depth = shallowRef(CuboidKnobs.STARTING_DEPTH);
const transitionDurationMs = shallowRef(CUBOID_DEFAULTS.transitionDurationMs);

const yaw = shallowRef(0);
const pitch = shallowRef(0);
const wanderingYaw = shallowRef(0);
const wanderingPitch = shallowRef(0);
const uprightYaw = shallowRef(0);
const uprightPitch = shallowRef(0);
const uprightController = shallowRef<CuboidController>();

const uprightFacing = computed(() => uprightController.value?.getFacing());

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const turnDurationMs = computed(() =>
    prefersReducedMotion.value ? NO_MOTION_DURATION_MS : transitionDurationMs.value,
);

const size = computed(() => ({ width: width.value, height: height.value, depth: depth.value }));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Six faces, two turns",
        readout: () =>
            `${CuboidUtils.getFacingFromTurns(yaw.value, pitch.value)} — across ${yaw.value}, up ${pitch.value}; the two counts are quarter turns rather than a face, so the box always takes the way it was pushed`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "wandering",
        name: "Turning to a neighbor on its own",
        readout: () =>
            `${CuboidUtils.getFacingFromTurns(wanderingYaw.value, wanderingPitch.value)} — every tick takes one quarter turn at random, discarding the ones that would leave the same face in view or turn back to the face it just left, so the box only ever moves on to a new face sharing an edge with this one`,
        path: `${EXAMPLES_ROOT}/Wandering.vue`,
    },
    {
        key: "upright",
        name: "Upright, by name, and by hand",
        readout: () =>
            `${uprightFacing.value ?? "front"} — across ${uprightYaw.value}, up ${uprightPitch.value}; the counts only record the presses here, so the box keeps its own orientation and the face names ask it for the shortest way round`,
        path: `${EXAMPLES_ROOT}/Upright.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="width" label="Width (px)" hint="How wide the box is.">
            <PageNumberField
                :value="width"
                :min="CuboidKnobs.MIN_EXTENT"
                :max="CuboidKnobs.MAX_EXTENT"
                :step="CuboidKnobs.EXTENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Width in pixels"
                @input="(value: number) => (width = value)"
            />
        </PageProp>

        <PageProp item-key="height" label="Height (px)" hint="How tall the box is.">
            <PageNumberField
                :value="height"
                :min="CuboidKnobs.MIN_EXTENT"
                :max="CuboidKnobs.MAX_EXTENT"
                :step="CuboidKnobs.EXTENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Height in pixels"
                @input="(value: number) => (height = value)"
            />
        </PageProp>

        <PageProp item-key="depth" label="Depth (px)" hint="How deep the box is, front face to back face.">
            <PageNumberField
                :value="depth"
                :min="CuboidKnobs.MIN_EXTENT"
                :max="CuboidKnobs.MAX_EXTENT"
                :step="CuboidKnobs.EXTENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Depth in pixels"
                @input="(value: number) => (depth = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Turn duration (ms)"
            hint="How long one turn from face to face takes, and how long the box takes to settle after a drag. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="CuboidKnobs.MIN_DURATION_MS"
                :max="CuboidKnobs.MAX_DURATION_MS"
                :step="CuboidKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Turn duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample
                v-model:yaw="yaw"
                v-model:pitch="pitch"
                :size="size"
                :transition-duration-ms="turnDurationMs"
            />
        </template>

        <template #wandering>
            <WanderingExampleWrapper
                v-model:yaw="wanderingYaw"
                v-model:pitch="wanderingPitch"
                :size="size"
                :transition-duration-ms="turnDurationMs"
            />
        </template>

        <template #upright>
            <UprightExampleWrapper
                v-model:yaw="uprightYaw"
                v-model:pitch="uprightPitch"
                v-model:controller="uprightController"
                :size="size"
                :transition-duration-ms="turnDurationMs"
            />
        </template>
    </PageExamples>
</template>
