<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, TRAIL_DEFAULTS } from "@thewaver/ss-components-vue";
import { TrailKnobs } from "@thewaver/ss-playground/App/Knobs/Trails.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CircuitExample from "./Examples/Circuit.vue";
import ConvoyExample from "./Examples/Convoy.vue";
import ScrollExample from "./Examples/Scroll.vue";
import TimelineExample from "./Examples/Timeline.vue";
import type { TrailScrollExampleProps } from "./TrailPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TrailPage/Examples";

const PERCENT = 100;
const HALF_WAY = 0.5;

const durationMs = shallowRef(TRAIL_DEFAULTS.durationMs);
const isLooping = shallowRef(TrailKnobs.STARTING_IS_LOOPING);
const isTurning = shallowRef(TrailKnobs.STARTING_IS_TURNING);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const circuitProgress = shallowRef(0);
const isCircuitPlaying = shallowRef(!prefersReducedMotion.value);
const timelineProgress = shallowRef(HALF_WAY);
const isTimelinePlaying = shallowRef(false);
const convoyProgress = shallowRef(0);
const isConvoyPlaying = shallowRef(!prefersReducedMotion.value);
const scrollProgress = shallowRef(0);

const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

const commonProps = computed<Omit<TrailScrollExampleProps, "isFollowing" | "onProgressChange">>(() => ({
    durationMs: durationMs.value,
    isLooping: isLooping.value,
    isTurning: isTurning.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "circuit",
        name: "Circuit",
        readout: () =>
            `${getPercent(circuitProgress.value)} round the loop, ${isCircuitPlaying.value ? "running" : "stopped"} — the playback signal starts and stops it, and the controller sends it back to the start`,
        path: `${EXAMPLES_ROOT}/Circuit.vue`,
    },
    {
        key: "timeline",
        name: "Timeline",
        readout: () =>
            `${getPercent(timelineProgress.value)} along the path — nothing is running, the slider is what puts the marker there`,
        path: `${EXAMPLES_ROOT}/Timeline.vue`,
    },
    {
        key: "convoy",
        name: "Convoy",
        readout: () =>
            `${getPercent(convoyProgress.value)} of the run, ${isConvoyPlaying.value ? "running" : "stopped"} — four travelers on one clock, each a share of the path behind the one in front; with looping off they wait at the start and the run ends when the last one arrives`,
        path: `${EXAMPLES_ROOT}/Convoy.vue`,
    },
    {
        key: "scroll",
        name: "Driven by scrolling",
        readout: () =>
            prefersReducedMotion.value
                ? "reduced motion is on, so the marker stays at the start instead of following the scroll"
                : `${getPercent(scrollProgress.value)} of the way through the box — nothing is running, scrolling the box is what moves the marker`,
        path: `${EXAMPLES_ROOT}/Scroll.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="durationMs"
            label="Lap duration (ms)"
            hint="How long the traveler takes to walk the path once, end to end."
        >
            <PageNumberField
                :value="durationMs"
                :min="TrailKnobs.MIN_DURATION_MS"
                :max="TrailKnobs.MAX_DURATION_MS"
                :step="TrailKnobs.DURATION_STEP_MS"
                ariaLabel="Lap duration in milliseconds"
                @input="(value: number) => (durationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="isLooping"
            label="Loops"
            hint="Sends the traveler round again as soon as it reaches the end, instead of stopping there."
        >
            <PageCheckField :value="isLooping" ariaLabel="Loops" @change="(value: boolean) => (isLooping = value)" />
        </PageProp>

        <PageProp
            item-key="isTurning"
            label="Faces along the path"
            hint="Turns the traveler to point the way it is going, instead of leaving it upright the whole way round."
        >
            <PageCheckField
                :value="isTurning"
                ariaLabel="Faces along the path"
                @change="(value: boolean) => (isTurning = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #circuit>
            <CircuitExample
                v-bind="commonProps"
                v-model:progress="circuitProgress"
                v-model:playback="isCircuitPlaying"
            />
        </template>

        <template #timeline>
            <TimelineExample
                v-bind="commonProps"
                v-model:progress="timelineProgress"
                v-model:playback="isTimelinePlaying"
            />
        </template>

        <template #convoy>
            <ConvoyExample v-bind="commonProps" v-model:progress="convoyProgress" v-model:playback="isConvoyPlaying" />
        </template>

        <template #scroll>
            <ScrollExample
                v-bind="commonProps"
                :is-following="!prefersReducedMotion"
                @progress-change="(progress: number) => (scrollProgress = progress)"
            />
        </template>
    </PageExamples>
</template>
