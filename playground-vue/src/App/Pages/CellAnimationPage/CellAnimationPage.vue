<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    CELL_ANIMATION_DEFAULTS,
    CELL_ANIMATION_FINAL_FRAMES,
    CellAnimationBreakpoints,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlayback,
    CellAnimationWeights,
} from "@thewaver/ss-components-vue";
import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    CellAnimationEasing,
    CellAnimationFinalFrame,
    CellAnimationPlaybackDirection,
    CellAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import type { Index2d } from "@thewaver/ss-utils";

import { CellAnimationKnobs } from "../../Knobs/CellAnimations.const";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { CellAnimationSharedProps } from "./CellAnimationPage.types";
import WipeExample from "./Examples/Wipe.vue";
import GradientExampleWrapper from "./GradientExampleWrapper.vue";
import ImageExampleWrapper from "./ImageExampleWrapper.vue";
import PatternExampleWrapper from "./PatternExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.vue";
const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.vue";
const DRAWN_SOURCE_PATH = "/src/App/PageComponents/SVGDefsSources/SVGDefsSources.const.ts";

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
const imagePlayback = shallowRef(true);
const imageProgress = shallowRef(0);

const originType = shallowRef<CellAnimationOrigins.OriginType>(CellAnimationKnobs.STARTING_ORIGIN_KEY);
const weightType = shallowRef<CellAnimationWeights.WeightType>(CellAnimationKnobs.STARTING_WEIGHT_KEY);
const animationType = shallowRef<CellAnimationKeyframes.AnimationType>(CellAnimationKnobs.STARTING_ANIMATION_KEY);
const animationDurationMs = shallowRef(CELL_ANIMATION_DEFAULTS.animationDurationMs);
const animationIterationDelayMs = shallowRef(CELL_ANIMATION_DEFAULTS.animationIterationDelayMs);
const animationIterationCount = shallowRef(CellAnimationKnobs.ENDLESS_ITERATION_COUNT);
const finalFrame = shallowRef<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
const cellCount = shallowRef<Index2d>({ ...CellAnimationKnobs.STARTING_CELL_COUNT });
const weightOpts = shallowRef<WeightOpts>({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS });
const breakpointOpts = shallowRef<CellAnimationBreakpointOpts>({ ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS });
const playbackOpts = shallowRef<CellAnimationPlaybackOpts>({ ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS });

const commonProps = computed<CellAnimationSharedProps>(() => ({
    cellCount: cellCount.value,
    originType: originType.value,
    weightType: weightType.value,
    weightOpts: weightOpts.value,
    breakpointOpts: breakpointOpts.value,
    playbackOpts: playbackOpts.value,
    animationType: animationType.value,
    animationDurationMs: animationDurationMs.value,
    animationIterationCount:
        animationIterationCount.value === CellAnimationKnobs.ENDLESS_ITERATION_COUNT
            ? Infinity
            : animationIterationCount.value,
    animationIterationDelayMs: animationIterationDelayMs.value,
    finalFrame: finalFrame.value,
}));

const setCellCount = (next: Partial<Index2d>) => {
    cellCount.value = { ...cellCount.value, ...next };
};

const setWeightOpts = (next: Partial<WeightOpts>) => {
    weightOpts.value = { ...weightOpts.value, ...next };
};

const setBreakpointOpts = (next: Partial<CellAnimationBreakpointOpts>) => {
    breakpointOpts.value = { ...breakpointOpts.value, ...next };
};

const setPlaybackOpts = (next: Partial<CellAnimationPlaybackOpts>) => {
    playbackOpts.value = { ...playbackOpts.value, ...next };
};

const examples: ExampleDefs[] = [
    {
        key: "image",
        name: "A photograph, sliced",
        readout: () =>
            `${Math.round(imageProgress.value * PERCENT)}% through the pass, ${imagePlayback.value ? "running" : "stopped"} — the progress signal is written by the component while it plays, and writing it moves the pass there`,
        path: DEFAULT_EXAMPLE_PATH,
    },
    {
        key: "gradient",
        name: "A gradient, drawn in place",
        readout: () =>
            "the Shape page's own gradients, serialized into a source — the start and the pause a script would have timed are written into the markup instead, so they run at the same length and rhythm as the cells",
        path: DRAWN_SOURCE_PATH,
    },
    {
        key: "pattern",
        name: "A pattern, drawn in place",
        readout: () =>
            "the same for the patterns, which flow on without a pause — a repeating fill has no beat to be out of step with",
        path: DRAWN_SOURCE_PATH,
    },
    {
        key: "wipe",
        name: "A screen wipe",
        readout: () =>
            "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
        path: WIPE_EXAMPLE_PATH,
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
                item-key="cellCountCols"
                label="Cell count (cols x rows)"
                hint="How many columns and rows the picture is cut into. More cells is a finer animation and more work per frame."
            >
                <div :class="styles.valueList">
                    <PageNumberField
                        :value="cellCount.col"
                        :min="CellAnimationKnobs.MIN_CELL_COUNT"
                        :max="CellAnimationKnobs.MAX_CELL_COUNT"
                        :step="CellAnimationKnobs.CELL_COUNT_STEP"
                        ariaLabel="Columns"
                        @input="(value: number) => setCellCount({ col: value })"
                    />
                    <PageNumberField
                        :value="cellCount.row"
                        :min="CellAnimationKnobs.MIN_CELL_COUNT"
                        :max="CellAnimationKnobs.MAX_CELL_COUNT"
                        :step="CellAnimationKnobs.CELL_COUNT_STEP"
                        ariaLabel="Rows"
                        @input="(value: number) => setCellCount({ row: value })"
                    />
                </div>
            </PageProp>

            <PageProp
                item-key="originType"
                label="Origin"
                hint="Where in the grid the animation starts from. It only applies to weights that are measured from a point."
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
                hint="How each cell's turn is decided: its distance from the origin, a wave, a random draw, and so on."
            >
                <PageGroupedSelectField
                    :value="weightType"
                    :groups="GROUPPED_WEIGHTS"
                    ariaLabel="Weight"
                    @change="(weight: CellAnimationWeights.WeightType) => (weightType = weight)"
                />
            </PageProp>

            <PageProp
                item-key="uniqueWeights"
                label="Unique weights"
                hint="Gives every cell a turn of its own, so no two move together even where the weight would have tied them."
            >
                <PageCheckField
                    :value="!!weightOpts.shouldMakeUnique"
                    ariaLabel="Unique weights"
                    @change="(value: boolean) => setWeightOpts({ shouldMakeUnique: value })"
                />
            </PageProp>

            <PageProp
                item-key="normalizeWeights"
                label="Normalize weights"
                hint="Spreads the weights out to fill the whole run, so the first cell starts at the beginning and the last ends at the end."
            >
                <PageCheckField
                    :value="!!weightOpts.shouldNormalize"
                    ariaLabel="Normalize weights"
                    @change="(value: boolean) => setWeightOpts({ shouldNormalize: value })"
                />
            </PageProp>

            <PageProp
                item-key="animationType"
                label="Animation"
                hint="What each cell actually does on its turn: fade, slide, spin, and the rest."
            >
                <PageGroupedSelectField
                    :value="animationType"
                    :groups="GROUPPED_ANIMATIONS"
                    ariaLabel="Animation"
                    @change="(anim: CellAnimationKeyframes.AnimationType) => (animationType = anim)"
                />
            </PageProp>

            <PageProp
                item-key="direction"
                label="Direction"
                hint="Which way the run travels through the weights, and so which cells go first."
            >
                <PageSelectField
                    :value="breakpointOpts.dir!"
                    :values="CellAnimationBreakpoints.DIRECTIONS"
                    ariaLabel="Direction"
                    @change="(dir: CellAnimationBreakpointDirection) => setBreakpointOpts({ dir })"
                />
            </PageProp>

            <PageProp
                item-key="easing"
                label="Easing"
                hint="The speed curve a single cell follows from its start to its finish."
            >
                <PageSelectField
                    :value="breakpointOpts.easing!"
                    :values="CellAnimationBreakpoints.EASINGS"
                    ariaLabel="Easing"
                    @change="(easing: CellAnimationEasing) => setBreakpointOpts({ easing })"
                />
            </PageProp>

            <PageProp
                item-key="smoothness01"
                label="Smoothness (0-1)"
                hint="How much a cell's own movement overlaps its neighbors'. 0 makes each cell wait its turn; 1 blurs them into one sweep."
            >
                <PageNumberField
                    :value="breakpointOpts.smoothness!"
                    :min="CellAnimationKnobs.MIN_SMOOTHNESS"
                    :max="CellAnimationKnobs.MAX_SMOOTHNESS"
                    :step="CellAnimationKnobs.SMOOTHNESS_STEP"
                    ariaLabel="Smoothness"
                    @input="(value: number) => setBreakpointOpts({ smoothness: value })"
                />
            </PageProp>

            <PageProp
                item-key="animationDurationMs"
                label="Animation duration (ms)"
                hint="How long one pass over the whole grid takes."
            >
                <PageNumberField
                    :value="animationDurationMs"
                    :min="CellAnimationKnobs.MIN_DURATION_MS"
                    :max="CellAnimationKnobs.MAX_DURATION_MS"
                    :step="CellAnimationKnobs.DURATION_STEP_MS"
                    ariaLabel="Animation duration"
                    @input="(value: number) => (animationDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="animationIterationDelayMs"
                label="Iteration delay (ms)"
                hint="How long the grid waits between one pass and the next."
            >
                <PageNumberField
                    :value="animationIterationDelayMs"
                    :min="CellAnimationKnobs.MIN_ITERATION_DELAY_MS"
                    :max="CellAnimationKnobs.MAX_ITERATION_DELAY_MS"
                    :step="CellAnimationKnobs.DURATION_STEP_MS"
                    ariaLabel="Iteration delay"
                    @input="(value: number) => (animationIterationDelayMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="animationIterationCount"
                label="Iteration count (-1 = endless)"
                hint="How many passes to run. -1 means it never stops, and 0 shows the final frame at once."
            >
                <PageNumberField
                    :value="animationIterationCount"
                    :min="CellAnimationKnobs.MIN_ITERATION_COUNT"
                    :max="CellAnimationKnobs.MAX_ITERATION_COUNT"
                    :step="CellAnimationKnobs.CELL_COUNT_STEP"
                    ariaLabel="Iteration count"
                    @input="(value: number) => (animationIterationCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="finalFrame"
                label="Final frame is"
                hint="What the grid is left showing once the passes are done. It has nothing to settle on while the run is endless."
            >
                <PageSelectField
                    :value="finalFrame"
                    :values="CELL_ANIMATION_FINAL_FRAMES"
                    :is-disabled="animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT"
                    ariaLabel="Final frame"
                    @change="(frame: CellAnimationFinalFrame) => (finalFrame = frame)"
                />
            </PageProp>

            <PageProp
                item-key="playbackDir"
                label="Playback direction"
                hint="Whether each pass runs the same way as the last, or turns round and comes back."
            >
                <PageSelectField
                    :value="playbackOpts.dir!"
                    :values="CellAnimationPlayback.DIRECTIONS"
                    ariaLabel="Playback direction"
                    @change="(dir: CellAnimationPlaybackDirection) => setPlaybackOpts({ dir })"
                />
            </PageProp>

            <PageProp
                item-key="holdMs"
                label="Hold at far end (ms)"
                hint="How long the grid rests at the far end before turning back. It only applies when the passes alternate."
            >
                <PageNumberField
                    :value="playbackOpts.holdMs!"
                    :min="CellAnimationKnobs.MIN_HOLD_MS"
                    :max="CellAnimationKnobs.MAX_HOLD_MS"
                    :step="CellAnimationKnobs.DURATION_STEP_MS"
                    :is-disabled="!playbackOpts.dir?.startsWith('alternate')"
                    ariaLabel="Hold at far end"
                    @input="(value: number) => setPlaybackOpts({ holdMs: value })"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #image>
                <ImageExampleWrapper
                    v-bind="commonProps"
                    v-model:playback="imagePlayback"
                    v-model:progress="imageProgress"
                />
            </template>

            <template #gradient>
                <GradientExampleWrapper v-bind="commonProps" v-model:playback="playback" />
            </template>

            <template #pattern>
                <PatternExampleWrapper v-bind="commonProps" v-model:playback="playback" />
            </template>

            <template #wipe>
                <WipeExample
                    :origin-type="originType"
                    :weight-type="weightType"
                    :weight-opts="weightOpts"
                    :breakpoint-opts="breakpointOpts"
                />
            </template>

            <template #stressTest>
                <StressTestWrapper v-bind="commonProps" v-model:playback="playback" :src="knight_profile" />
            </template>
        </PageExamples>
    </div>
</template>
