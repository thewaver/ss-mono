<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components-vue";
import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import type { Index2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExampleWrapper from "./DefaultExampleWrapper.vue";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";
import ShapedExampleWrapper from "./ShapedExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ParticleFieldPage/Examples";
const PERCENT = 100;

const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

const groupOptions = <T extends string>(keys: readonly T[]) => {
    const result: Record<string, T[]> = {};

    for (const key of keys) {
        const group = extractOptionGroupWord(key);

        result[group] ??= [];
        result[group].push(key);
    }

    return Object.entries(result);
};

const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.WEIGHT_TYPES);
const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

const playback = shallowRef(true);
const defaultPlayback = shallowRef(true);
const progress = shallowRef(0);

const spawnChance = shallowRef(ParticleFieldKnobs.STARTING_SPAWN_CHANCE);
const durationMs = shallowRef(ParticleFieldKnobs.STARTING_DURATION_MS);
const lifetimeMs = shallowRef(ParticleFieldKnobs.STARTING_LIFETIME_MS);
const iterationDelayMs = shallowRef(ParticleFieldKnobs.STARTING_ITERATION_DELAY_MS);
const holdShare = shallowRef(ParticleFieldKnobs.STARTING_HOLD_SHARE);
const isScattered = shallowRef(ParticleFieldKnobs.STARTING_IS_SCATTERED);
const originType = shallowRef<CellAnimationOrigins.OriginType>(ParticleFieldKnobs.STARTING_ORIGIN_KEY);
const weightType = shallowRef<CellAnimationWeights.WeightType>(ParticleFieldKnobs.STARTING_WEIGHT_KEY);
const animationType = shallowRef<CellAnimationKeyframes.AnimationType>(ParticleFieldKnobs.STARTING_ANIMATION_KEY);
const cellCount = shallowRef<Index2d>({ ...ParticleFieldKnobs.STARTING_CELL_COUNT });

const commonProps = computed<Omit<ParticleFieldExampleProps, "playback" | "onUpdate:playback">>(() => ({
    cellCount: cellCount.value,
    spawnChance: spawnChance.value,
    animationIterationDelayMs: iterationDelayMs.value,
    animationDurationMs: durationMs.value,
    particleLifetimeMs: lifetimeMs.value,
    originType: originType.value,
    weightType: weightType.value,
    animationType: animationType.value,
    holdShare: holdShare.value,
    isScattered: isScattered.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "The whole box",
        readout: () =>
            `${Math.round(progress.value * PERCENT)}% through the pass, ${defaultPlayback.value ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "shaped",
        name: "Inside a shape",
        readout: () =>
            "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
        path: `${EXAMPLES_ROOT}/Shaped.vue`,
    },
    {
        key: "stressTest",
        name: "Stress Test",
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="spawnChance"
                label="Spawn chance (0-1)"
                hint="The chance each cell spawns in a given pass. 1 spawns every cell every pass; lower leaves gaps that change from pass to pass. When a cell does spawn is still its weight's call."
            >
                <PageNumberField
                    :value="spawnChance"
                    :min="ParticleFieldKnobs.MIN_SPAWN_CHANCE"
                    :max="ParticleFieldKnobs.MAX_SPAWN_CHANCE"
                    :step="ParticleFieldKnobs.SPAWN_CHANCE_STEP"
                    ariaLabel="Spawn chance"
                    @input="(value: number) => (spawnChance = value)"
                />
            </PageProp>

            <PageProp
                item-key="cellCount"
                label="Cell count (cols x rows)"
                hint="How many columns and rows the field is split into. A cell holds one particle at a time."
            >
                <div :class="styles.valueList">
                    <PageNumberField
                        :value="cellCount.col"
                        :min="ParticleFieldKnobs.MIN_CELL_COUNT"
                        :max="ParticleFieldKnobs.MAX_CELL_COUNT"
                        :step="ParticleFieldKnobs.CELL_COUNT_STEP"
                        ariaLabel="Columns"
                        @input="(value: number) => (cellCount = { ...cellCount, col: value })"
                    />
                    <PageNumberField
                        :value="cellCount.row"
                        :min="ParticleFieldKnobs.MIN_CELL_COUNT"
                        :max="ParticleFieldKnobs.MAX_CELL_COUNT"
                        :step="ParticleFieldKnobs.CELL_COUNT_STEP"
                        ariaLabel="Rows"
                        @input="(value: number) => (cellCount = { ...cellCount, row: value })"
                    />
                </div>
            </PageProp>

            <PageProp
                item-key="originType"
                label="Origin"
                hint="Where in the grid the weights are measured from. It only applies to weights that are measured from a point."
            >
                <PageSelectField
                    :value="originType"
                    :values="CellAnimationOrigins.ORIGIN_TYPES"
                    :is-disabled="!CellAnimationWeights.isOriginAware(weightType)"
                    ariaLabel="Origin"
                    @change="(origin: CellAnimationOrigins.OriginType) => (originType = origin)"
                />
            </PageProp>

            <PageProp
                item-key="weightType"
                label="Weight"
                hint="The same weights CellAnimation uses: a heavy cell spawns early in the pass and a light one late."
            >
                <PageGroupedSelectField
                    :value="weightType"
                    :groups="GROUPPED_WEIGHTS"
                    ariaLabel="Weight"
                    @change="(weight: CellAnimationWeights.WeightType) => (weightType = weight)"
                />
            </PageProp>

            <PageProp
                item-key="animationType"
                label="Animation"
                hint="How a particle appears, played forwards as it arrives and backwards as it leaves: CellAnimation's own keyframes."
            >
                <PageGroupedSelectField
                    :value="animationType"
                    :groups="GROUPPED_ANIMATIONS"
                    ariaLabel="Animation"
                    @change="(anim: CellAnimationKeyframes.AnimationType) => (animationType = anim)"
                />
            </PageProp>

            <PageProp
                item-key="holdShare"
                label="Hold (0-1)"
                hint="How much of a particle's life it spends fully shown, between appearing and disappearing. 1 cuts in and out."
            >
                <PageNumberField
                    :value="holdShare"
                    :min="ParticleFieldKnobs.MIN_HOLD_SHARE"
                    :max="ParticleFieldKnobs.MAX_HOLD_SHARE"
                    :step="ParticleFieldKnobs.HOLD_SHARE_STEP"
                    ariaLabel="Hold share"
                    @input="(value: number) => (holdShare = value)"
                />
            </PageProp>

            <PageProp
                item-key="isScattered"
                label="Scatter in cell"
                hint="Places each particle at a random point in its cell rather than at the center, so the grid stops showing."
            >
                <PageCheckField
                    :value="isScattered"
                    ariaLabel="Scatter in cell"
                    @change="(value: boolean) => (isScattered = value)"
                />
            </PageProp>

            <PageProp
                item-key="animationDurationMs"
                label="Duration (ms)"
                hint="How long one pass over the grid takes, and so the shortest time between two spawns from the same cell."
            >
                <PageNumberField
                    :value="durationMs"
                    :min="ParticleFieldKnobs.MIN_DURATION_MS"
                    :max="ParticleFieldKnobs.MAX_DURATION_MS"
                    :step="ParticleFieldKnobs.DURATION_STEP_MS"
                    ariaLabel="Duration"
                    @input="(value: number) => (durationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="particleLifetimeMs"
                label="Lifetime (ms)"
                hint="How long one particle lives, from appearing to being removed."
            >
                <PageNumberField
                    :value="lifetimeMs"
                    :min="ParticleFieldKnobs.MIN_LIFETIME_MS"
                    :max="ParticleFieldKnobs.MAX_LIFETIME_MS"
                    :step="ParticleFieldKnobs.DURATION_STEP_MS"
                    ariaLabel="Lifetime"
                    @input="(value: number) => (lifetimeMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="iterationDelayMs"
                label="Iteration delay (ms)"
                hint="How long the field waits between one pass and the next."
            >
                <PageNumberField
                    :value="iterationDelayMs"
                    :min="ParticleFieldKnobs.MIN_ITERATION_DELAY_MS"
                    :max="ParticleFieldKnobs.MAX_ITERATION_DELAY_MS"
                    :step="ParticleFieldKnobs.DURATION_STEP_MS"
                    ariaLabel="Iteration delay"
                    @input="(value: number) => (iterationDelayMs = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #default>
                <DefaultExampleWrapper
                    v-bind="commonProps"
                    v-model:progress="progress"
                    v-model:ownPlayback="defaultPlayback"
                />
            </template>

            <template #shaped>
                <ShapedExampleWrapper v-bind="commonProps" v-model:playback="playback" />
            </template>

            <template #stressTest>
                <StressTestWrapper v-bind="commonProps" v-model:playback="playback" />
            </template>
        </PageExamples>
    </div>
</template>
