<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CellAnimationKeyframes, CellAnimationOrigins, SliceAnimationWeights } from "@thewaver/ss-components-vue";
import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
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

const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.WEIGHT_TYPES);
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
const weightType = shallowRef<SliceAnimationWeights.WeightType>(ParticleFieldKnobs.STARTING_WEIGHT_KEY);
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
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `${Math.round(progress.value * PERCENT)}% through the pass, ${defaultPlayback.value ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "shaped",
        name: EXAMPLE_NAMES.shaped,
        readout: () =>
            "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
        path: `${EXAMPLES_ROOT}/Shaped.vue`,
    },
    {
        key: "stressTest",
        name: EXAMPLE_NAMES.stressTest,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp item-key="spawnChance" v-bind="ParticleFieldKnobs.SPAWN_CHANCE_TEXT">
                <PageNumberField
                    :value="spawnChance"
                    :min="ParticleFieldKnobs.MIN_SPAWN_CHANCE"
                    :max="ParticleFieldKnobs.MAX_SPAWN_CHANCE"
                    :step="ParticleFieldKnobs.SPAWN_CHANCE_STEP"
                    ariaLabel="Spawn chance"
                    @input="(value: number) => (spawnChance = value)"
                />
            </PageProp>

            <PageProp item-key="cellCount" v-bind="ParticleFieldKnobs.CELL_COUNT_TEXT">
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

            <PageProp item-key="originType" v-bind="ParticleFieldKnobs.ORIGIN_TYPE_TEXT">
                <PageSelectField
                    :value="originType"
                    :values="CellAnimationOrigins.ORIGIN_TYPES"
                    :is-disabled="!SliceAnimationWeights.isOriginAware(weightType)"
                    ariaLabel="Origin"
                    @change="(origin: CellAnimationOrigins.OriginType) => (originType = origin)"
                />
            </PageProp>

            <PageProp item-key="weightType" v-bind="ParticleFieldKnobs.WEIGHT_TYPE_TEXT">
                <PageGroupedSelectField
                    :value="weightType"
                    :groups="GROUPPED_WEIGHTS"
                    ariaLabel="Weight"
                    @change="(weight: SliceAnimationWeights.WeightType) => (weightType = weight)"
                />
            </PageProp>

            <PageProp item-key="animationType" v-bind="ParticleFieldKnobs.ANIMATION_TYPE_TEXT">
                <PageGroupedSelectField
                    :value="animationType"
                    :groups="GROUPPED_ANIMATIONS"
                    ariaLabel="Animation"
                    @change="(anim: CellAnimationKeyframes.AnimationType) => (animationType = anim)"
                />
            </PageProp>

            <PageProp item-key="holdShare" v-bind="ParticleFieldKnobs.HOLD_SHARE_TEXT">
                <PageNumberField
                    :value="holdShare"
                    :min="ParticleFieldKnobs.MIN_HOLD_SHARE"
                    :max="ParticleFieldKnobs.MAX_HOLD_SHARE"
                    :step="ParticleFieldKnobs.HOLD_SHARE_STEP"
                    ariaLabel="Hold share"
                    @input="(value: number) => (holdShare = value)"
                />
            </PageProp>

            <PageProp item-key="isScattered" v-bind="ParticleFieldKnobs.IS_SCATTERED_TEXT">
                <PageCheckField
                    :value="isScattered"
                    ariaLabel="Scatter in cell"
                    @change="(value: boolean) => (isScattered = value)"
                />
            </PageProp>

            <PageProp item-key="animationDurationMs" v-bind="ParticleFieldKnobs.ANIMATION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="durationMs"
                    :min="ParticleFieldKnobs.MIN_DURATION_MS"
                    :max="ParticleFieldKnobs.MAX_DURATION_MS"
                    :step="ParticleFieldKnobs.DURATION_STEP_MS"
                    ariaLabel="Duration"
                    @input="(value: number) => (durationMs = value)"
                />
            </PageProp>

            <PageProp item-key="particleLifetimeMs" v-bind="ParticleFieldKnobs.PARTICLE_LIFETIME_MS_TEXT">
                <PageNumberField
                    :value="lifetimeMs"
                    :min="ParticleFieldKnobs.MIN_LIFETIME_MS"
                    :max="ParticleFieldKnobs.MAX_LIFETIME_MS"
                    :step="ParticleFieldKnobs.DURATION_STEP_MS"
                    ariaLabel="Lifetime"
                    @input="(value: number) => (lifetimeMs = value)"
                />
            </PageProp>

            <PageProp item-key="iterationDelayMs" v-bind="ParticleFieldKnobs.ITERATION_DELAY_MS_TEXT">
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
