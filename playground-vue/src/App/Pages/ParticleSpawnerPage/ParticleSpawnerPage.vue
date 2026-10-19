<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { PARTICLE_SPAWNER_DEFAULTS } from "@thewaver/ss-components-vue";
import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    BOX_HEIGHT,
    BOX_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    ITERATION_PATTERNS,
    ITERATION_PATTERN_KEYS,
    NO_TRAVEL_DEFS,
    TRAVEL_EASING_FNS,
    TRAVEL_EASING_KEYS,
    TRAVEL_PATTERN_FACTORIES,
    TRAVEL_PATTERN_KEYS,
    applyOvershoot,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BurstExample from "./Examples/Burst.vue";
import DiagonalExample from "./Examples/Diagonal.vue";
import GridExample from "./Examples/Grid.vue";
import ManyToOneExample from "./Examples/ManyToOne.vue";
import MovingTargetExample from "./Examples/MovingTarget.vue";
import MultipleTargetsExample from "./Examples/MultipleTargets.vue";
import RadialExample from "./Examples/Radial.vue";
import RoundTripExample from "./Examples/RoundTrip.vue";
import SingleTargetExample from "./Examples/SingleTarget.vue";
import VerticalExample from "./Examples/Vertical.vue";
import type {
    IterationPattern,
    ParticleSpawnerExampleProps,
    ParticleTravelPattern,
    TravelEasingKey,
} from "./ParticleSpawnerPage.types";
import StressTestWrapper from "./StressTestWrapper.vue";

const particleCount = shallowRef(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
const travelDurationMs = shallowRef(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
const restDurationMs = shallowRef(PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
const spawnDelayMs = shallowRef(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
const overshootPercent = shallowRef(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
const travelEasingKey = shallowRef<TravelEasingKey>(ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY);

const travelPatternKey = shallowRef<ParticleTravelPattern>(ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY);

const iterationPatternKey = shallowRef<IterationPattern>(ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY);

const areTargetsHidden = shallowRef(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

const travelDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});
const playback = shallowRef(true);

const travelKnobs = computed(() => ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[travelPatternKey.value]);
const travelDefaults = computed(() => ParticleSpawnerKnobs.TRAVEL_DEFAULTS_BY_PATTERN[travelPatternKey.value]);
const pickedTravelDefs = computed(() => travelDefs.value[travelPatternKey.value] ?? NO_TRAVEL_DEFS);

const computeParticlePos = computed(() => {
    const evaluate = TRAVEL_PATTERN_FACTORIES[travelPatternKey.value]({
        ...travelDefaults.value,
        ...pickedTravelDefs.value,
    } as Record<string, number>);
    const easingFn = TRAVEL_EASING_FNS[travelEasingKey.value];
    const overshoot = overshootPercent.value;

    return (defs: Parameters<typeof evaluate>[0], t: number) =>
        evaluate(defs, applyOvershoot(t, easingFn(t), overshoot));
});

const spawnIterationPatterns = computed(() => ITERATION_PATTERNS[iterationPatternKey.value]());

const commonProps = computed<Omit<ParticleSpawnerExampleProps, "playback">>(() => ({
    particleCount: particleCount.value,
    travelDurationMs: travelDurationMs.value,
    restDurationMs: restDurationMs.value,
    spawnDelayMs: spawnDelayMs.value,
    spawnIterationPatterns: spawnIterationPatterns.value,
    computeParticlePos: computeParticlePos.value,
    areTargetsHidden: areTargetsHidden.value,
}));

const setTravelDef = (key: string, value: number | boolean) => {
    travelDefs.value = {
        ...travelDefs.value,
        [travelPatternKey.value]: { ...travelDefs.value[travelPatternKey.value], [key]: value },
    };
};

const examples: ExampleDefs[] = [
    {
        key: "singleTarget",
        name: EXAMPLE_NAMES.singleTarget,
        path: `${EXAMPLES_ROOT}/SingleTarget.vue`,
    },
    {
        key: "vertical",
        name: EXAMPLE_NAMES.vertical,
        path: `${EXAMPLES_ROOT}/Vertical.vue`,
    },
    {
        key: "diagonal",
        name: EXAMPLE_NAMES.diagonal,
        path: `${EXAMPLES_ROOT}/Diagonal.vue`,
    },
    {
        key: "movingTarget",
        name: EXAMPLE_NAMES.movingTarget,
        path: `${EXAMPLES_ROOT}/MovingTarget.vue`,
    },
    {
        key: "radial",
        name: EXAMPLE_NAMES.radial,
        path: `${EXAMPLES_ROOT}/Radial.vue`,
    },
    {
        key: "manyToOne",
        name: EXAMPLE_NAMES.manyToOne,
        path: `${EXAMPLES_ROOT}/ManyToOne.vue`,
    },
    {
        key: "burst",
        name: EXAMPLE_NAMES.burst,
        path: `${EXAMPLES_ROOT}/Burst.vue`,
    },
    {
        key: "roundTrip",
        name: EXAMPLE_NAMES.roundTrip,
        path: `${EXAMPLES_ROOT}/RoundTrip.vue`,
    },
    {
        key: "multipleTargets",
        name: EXAMPLE_NAMES.multipleTargets,
        path: `${EXAMPLES_ROOT}/MultipleTargets.vue`,
    },
    {
        key: "grid",
        name: EXAMPLE_NAMES.grid,
        path: `${EXAMPLES_ROOT}/Grid.vue`,
    },
    {
        key: "stressTest",
        name: EXAMPLE_NAMES.stressTest,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="travelPattern"
                controls="Picks the example's travel path function sent to ParticleSpawnerProps.computeParticlePos"
                label="Travel pattern"
                hint="The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it."
            >
                <PageSelectField
                    :value="travelPatternKey"
                    :values="TRAVEL_PATTERN_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Travel pattern"
                    @change="(key: ParticleTravelPattern) => (travelPatternKey = key)"
                />
            </PageProp>

            <PageKnobs
                :knobs="travelKnobs"
                :defaults="travelDefaults"
                :values="pickedTravelDefs"
                :width="FIELD_WIDTH"
                @input="setTravelDef"
            />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageProp
                item-key="particleCount"
                controls="Sets ParticleSpawnerProps.particleCount"
                label="Particle count"
                hint="How many particles are sent on each round."
            >
                <PageNumberField
                    :value="particleCount"
                    :min="ParticleSpawnerKnobs.MIN_PARTICLE_COUNT"
                    :max="ParticleSpawnerKnobs.MAX_PARTICLE_COUNT"
                    :step="ParticleSpawnerKnobs.PARTICLE_COUNT_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Particle count"
                    @input="(value: number) => (particleCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="travelDurationMs"
                controls="Sets ParticleSpawnerProps.travelDurationMs"
                label="Travel (ms)"
                hint="How long one particle takes to walk its path."
            >
                <PageNumberField
                    :value="travelDurationMs"
                    :min="ParticleSpawnerKnobs.MIN_TRAVEL_DURATION_MS"
                    :max="ParticleSpawnerKnobs.MAX_TRAVEL_DURATION_MS"
                    :step="ParticleSpawnerKnobs.TRAVEL_DURATION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Travel duration in milliseconds"
                    @input="(value: number) => (travelDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="restDurationMs"
                controls="Sets ParticleSpawnerProps.restDurationMs"
                label="Rest duration (ms)"
                hint="How long a particle stays put at the end of its path before it disappears."
            >
                <PageNumberField
                    :value="restDurationMs"
                    :min="ParticleSpawnerKnobs.MIN_RETENTION_MS"
                    :max="ParticleSpawnerKnobs.MAX_RETENTION_MS"
                    :step="ParticleSpawnerKnobs.RETENTION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Rest duration in milliseconds"
                    @input="(value: number) => (restDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="spawnDelayMs"
                controls="Sets ParticleSpawnerProps.spawnDelayMs"
                label="Spawn delay (ms)"
                hint="How long each particle waits after the one before it sets off, which is what staggers them."
            >
                <PageNumberField
                    :value="spawnDelayMs"
                    :min="ParticleSpawnerKnobs.MIN_SPAWN_DELAY_MS"
                    :max="ParticleSpawnerKnobs.MAX_SPAWN_DELAY_MS"
                    :step="ParticleSpawnerKnobs.SPAWN_DELAY_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Spawn delay in milliseconds"
                    @input="(value: number) => (spawnDelayMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="iterationPattern"
                controls="Picks the example's list of rounds sent to ParticleSpawnerProps.spawnIterationPatterns"
                label="Iteration pattern"
                hint="How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all."
            >
                <PageSelectField
                    :value="iterationPatternKey"
                    :values="ITERATION_PATTERN_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Iteration pattern"
                    @change="(key: IterationPattern) => (iterationPatternKey = key)"
                />
            </PageProp>

            <PageProp
                item-key="overshootPercent"
                controls="Sets how far the example's travel path runs past its end, sent to ParticleSpawnerProps.computeParticlePos"
                label="Overshoot (%)"
                hint="How far a particle runs past its destination before coming back to it. 0 stops it dead on target."
            >
                <PageNumberField
                    :value="overshootPercent"
                    :min="ParticleSpawnerKnobs.MIN_OVERSHOOT_PERCENT"
                    :max="ParticleSpawnerKnobs.MAX_OVERSHOOT_PERCENT"
                    :step="ParticleSpawnerKnobs.OVERSHOOT_PERCENT_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Overshoot percent"
                    @input="(value: number) => (overshootPercent = value)"
                />
            </PageProp>

            <PageProp
                item-key="areTargetsHidden"
                :controls="EXAMPLES_ONLY_PROP"
                label="Hide targets"
                hint="Takes the target markers out of sight while leaving them where they are, so the particles still land on them."
            >
                <PageCheckField
                    :value="areTargetsHidden"
                    ariaLabel="Hide targets"
                    @change="(value: boolean) => (areTargetsHidden = value)"
                />
            </PageProp>

            <PageProp
                item-key="travelEasing"
                controls="Picks the speed curve of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos"
                label="Travel easing"
                hint="The speed curve a particle follows along its path."
            >
                <PageSelectField
                    :value="travelEasingKey"
                    :values="TRAVEL_EASING_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Travel easing"
                    @change="(key: TravelEasingKey) => (travelEasingKey = key)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #singleTarget>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <SingleTargetExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #vertical>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <VerticalExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #diagonal>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <DiagonalExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #movingTarget>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <MovingTargetExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #radial>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <RadialExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #manyToOne>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <ManyToOneExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #burst>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <BurstExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #roundTrip>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <RoundTripExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #multipleTargets>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <MultipleTargetsExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #grid>
            <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
                <GridExample v-bind="commonProps" v-model:playback="playback" />
            </PageMeasureBox>
        </template>

        <template #stressTest>
            <StressTestWrapper v-bind="commonProps" v-model:playback="playback" />
        </template>
    </PageExamples>
</template>
