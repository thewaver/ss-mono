<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    CELL_ANIMATION_DEFAULTS,
    CELL_ANIMATION_FINAL_FRAMES,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationBreakpoints,
    SliceAnimationPlayback,
    SliceAnimationPlaybackUtils,
    SliceAnimationWeights,
} from "@thewaver/ss-components-vue";
import type {
    CellAnimationFinalFrame,
    SVGDefsSamples,
    SliceAnimationBreakpointDirection,
    SliceAnimationBreakpointOpts,
    SliceAnimationEasing,
    SliceAnimationPlaybackDirection,
    SliceAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components-vue";
import { CellAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/CellAnimations.const";
import {
    EXAMPLE_NAMES,
    PERCENT,
    SOURCE_READOUTS,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { CellAnimationSourceKind } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.types";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import type { Count2d, Size2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageFileField from "../../PageComponents/Field/PageFileField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSourcesVue.const";
import type { CellAnimationSharedProps } from "./CellAnimationPage.types";
import WipeExample from "./Examples/Wipe.vue";
import SourcedExampleWrapper from "./SourcedExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.vue";
const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.vue";

const computeContainerWidth = (size: Size2d, longestSide: number) =>
    (longestSide * size.width) / Math.max(size.width, size.height);

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
const sourcedPlayback = shallowRef(true);
const sourcedProgress = shallowRef(0);

const sourceKind = shallowRef<CellAnimationSourceKind>(CellAnimationKnobs.STARTING_SOURCE_KIND);
const imageSrc = shallowRef(knight_profile);
const gradientKey = shallowRef<SVGDefsSamples.Gradient.Timed.SampleKey>(CellAnimationKnobs.STARTING_GRADIENT_KEY);
const patternKey = shallowRef<SVGDefsSamples.Pattern.Timed.SampleKey>(CellAnimationKnobs.STARTING_PATTERN_KEY);
const sourceRatio = shallowRef<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

const originType = shallowRef<CellAnimationOrigins.OriginType>(CellAnimationKnobs.STARTING_ORIGIN_KEY);
const weightType = shallowRef<SliceAnimationWeights.WeightType>(CellAnimationKnobs.STARTING_WEIGHT_KEY);
const animationType = shallowRef<CellAnimationKeyframes.AnimationType>(CellAnimationKnobs.STARTING_ANIMATION_KEY);
const animationDurationMs = shallowRef(CELL_ANIMATION_DEFAULTS.animationDurationMs);
const animationIterationDelayMs = shallowRef(CELL_ANIMATION_DEFAULTS.animationIterationDelayMs);
const animationIterationCount = shallowRef(CellAnimationKnobs.ENDLESS_ITERATION_COUNT);
const finalFrame = shallowRef<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
const cellCount = shallowRef<Count2d>({ ...CellAnimationKnobs.STARTING_CELL_COUNT });
const weightOpts = shallowRef<WeightOpts>({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS });
const breakpointOpts = shallowRef<SliceAnimationBreakpointOpts>({ ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS });
const playbackOpts = shallowRef<SliceAnimationPlaybackOpts>({ ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS });

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

const sourceSize = computed(() => SVGDefsSources.computeSourceSize(sourceRatio.value));

const cycleDurationMs = computed(() =>
    SliceAnimationPlaybackUtils.computeCycleDurationMs(animationDurationMs.value, playbackOpts.value),
);

const sourcedSrc = computed(() => {
    if (sourceKind.value === "gradient") {
        return SVGDefsSources.computeGradientSource(
            gradientKey.value,
            sourceSize.value,
            cycleDurationMs.value,
            animationIterationDelayMs.value,
        );
    }

    if (sourceKind.value === "pattern") {
        return SVGDefsSources.computePatternSource(patternKey.value, sourceSize.value, cycleDurationMs.value);
    }

    return imageSrc.value;
});

const computeSourcedWidth = (longestSide: number) =>
    sourceKind.value === "image" ? longestSide : computeContainerWidth(sourceSize.value, longestSide);

const pickImage = (file: File) => {
    imageSrc.value = URL.createObjectURL(file);
};

const setCellCount = (next: Partial<Count2d>) => {
    cellCount.value = { ...cellCount.value, ...next };
};

const setWeightOpts = (next: Partial<WeightOpts>) => {
    weightOpts.value = { ...weightOpts.value, ...next };
};

const setBreakpointOpts = (next: Partial<SliceAnimationBreakpointOpts>) => {
    breakpointOpts.value = { ...breakpointOpts.value, ...next };
};

const setPlaybackOpts = (next: Partial<SliceAnimationPlaybackOpts>) => {
    playbackOpts.value = { ...playbackOpts.value, ...next };
};

const examples: ExampleDefs[] = [
    {
        key: "source",
        name: EXAMPLE_NAMES.source,
        readout: () =>
            `${Math.round(sourcedProgress.value * PERCENT)}% through the pass, ${sourcedPlayback.value ? "running" : "stopped"} — ${SOURCE_READOUTS[sourceKind.value]}`,
        path: DEFAULT_EXAMPLE_PATH,
    },
    {
        key: "wipe",
        name: EXAMPLE_NAMES.wipe,
        readout: () =>
            "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
        path: WIPE_EXAMPLE_PATH,
    },
    {
        key: "stressTest",
        name: EXAMPLE_NAMES.stressTest,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsGroups>
            <PagePropsPanel scope="sample">
                <PageProp item-key="sourceKind" v-bind="CellAnimationKnobs.SOURCE_KIND_TEXT">
                    <PageSelectField
                        :value="sourceKind"
                        :values="CellAnimationKnobs.SOURCE_KINDS"
                        ariaLabel="Source"
                        @change="(next: CellAnimationSourceKind) => (sourceKind = next)"
                    />
                </PageProp>

                <PageProp v-if="sourceKind === 'image'" item-key="image" v-bind="CellAnimationKnobs.IMAGE_TEXT">
                    <PageFileField accept="image/*" ariaLabel="Image" @pick="pickImage" />
                </PageProp>

                <PageProp
                    v-if="sourceKind === 'gradient'"
                    item-key="gradient"
                    v-bind="CellAnimationKnobs.GRADIENT_TEXT"
                >
                    <PageSelectField
                        :value="gradientKey"
                        :values="SVGDefsSources.GRADIENT_KEYS"
                        ariaLabel="Gradient"
                        @change="(next: SVGDefsSamples.Gradient.Timed.SampleKey) => (gradientKey = next)"
                    />
                </PageProp>

                <PageProp v-if="sourceKind === 'pattern'" item-key="pattern" v-bind="CellAnimationKnobs.PATTERN_TEXT">
                    <PageSelectField
                        :value="patternKey"
                        :values="SVGDefsSources.PATTERN_KEYS"
                        ariaLabel="Pattern"
                        @change="(next: SVGDefsSamples.Pattern.Timed.SampleKey) => (patternKey = next)"
                    />
                </PageProp>

                <PageProp
                    v-if="sourceKind !== 'image'"
                    item-key="sourceRatio"
                    v-bind="CellAnimationKnobs.SOURCE_RATIO_TEXT"
                >
                    <PageSelectField
                        :value="sourceRatio"
                        :values="SVGDefsSources.SOURCE_RATIOS"
                        ariaLabel="Ratio"
                        @change="(next: SVGDefsSources.SourceRatio) => (sourceRatio = next)"
                    />
                </PageProp>
            </PagePropsPanel>

            <PagePropsDivider />

            <PagePropsPanel scope="global">
                <PageProp item-key="cellCountCols" v-bind="CellAnimationKnobs.CELL_COUNT_COLS_TEXT">
                    <div :class="styles.valueList">
                        <PageNumberField
                            :value="cellCount.colCount"
                            :min="CellAnimationKnobs.MIN_CELL_COUNT"
                            :max="CellAnimationKnobs.MAX_CELL_COUNT"
                            :step="CellAnimationKnobs.CELL_COUNT_STEP"
                            ariaLabel="Columns"
                            @input="(value: number) => setCellCount({ colCount: value })"
                        />
                        <PageNumberField
                            :value="cellCount.rowCount"
                            :min="CellAnimationKnobs.MIN_CELL_COUNT"
                            :max="CellAnimationKnobs.MAX_CELL_COUNT"
                            :step="CellAnimationKnobs.CELL_COUNT_STEP"
                            ariaLabel="Rows"
                            @input="(value: number) => setCellCount({ rowCount: value })"
                        />
                    </div>
                </PageProp>

                <PageProp item-key="originType" v-bind="CellAnimationKnobs.ORIGIN_TYPE_TEXT">
                    <PageSelectField
                        :value="originType"
                        :values="CellAnimationOrigins.ORIGIN_TYPES"
                        :is-disabled="!SliceAnimationWeights.isOriginAware(weightType)"
                        ariaLabel="Origin"
                        @change="(origin: CellAnimationOrigins.OriginType) => (originType = origin)"
                    />
                </PageProp>

                <PageProp item-key="weightType" v-bind="CellAnimationKnobs.WEIGHT_TYPE_TEXT">
                    <PageGroupedSelectField
                        :value="weightType"
                        :groups="GROUPPED_WEIGHTS"
                        ariaLabel="Weight"
                        @change="(weight: SliceAnimationWeights.WeightType) => (weightType = weight)"
                    />
                </PageProp>

                <PageProp item-key="uniqueWeights" v-bind="CellAnimationKnobs.UNIQUE_WEIGHTS_TEXT">
                    <PageCheckField
                        :value="!!weightOpts.shouldMakeUnique"
                        ariaLabel="Unique weights"
                        @change="(value: boolean) => setWeightOpts({ shouldMakeUnique: value })"
                    />
                </PageProp>

                <PageProp item-key="normalizeWeights" v-bind="CellAnimationKnobs.NORMALIZE_WEIGHTS_TEXT">
                    <PageCheckField
                        :value="!!weightOpts.shouldNormalize"
                        ariaLabel="Normalize weights"
                        @change="(value: boolean) => setWeightOpts({ shouldNormalize: value })"
                    />
                </PageProp>

                <PageProp item-key="animationType" v-bind="CellAnimationKnobs.ANIMATION_TYPE_TEXT">
                    <PageGroupedSelectField
                        :value="animationType"
                        :groups="GROUPPED_ANIMATIONS"
                        ariaLabel="Animation"
                        @change="(anim: CellAnimationKeyframes.AnimationType) => (animationType = anim)"
                    />
                </PageProp>

                <PageProp item-key="direction" v-bind="CellAnimationKnobs.DIRECTION_TEXT">
                    <PageSelectField
                        :value="breakpointOpts.dir!"
                        :values="SliceAnimationBreakpoints.DIRECTIONS"
                        ariaLabel="Direction"
                        @change="(dir: SliceAnimationBreakpointDirection) => setBreakpointOpts({ dir })"
                    />
                </PageProp>

                <PageProp item-key="easing" v-bind="CellAnimationKnobs.EASING_TEXT">
                    <PageSelectField
                        :value="breakpointOpts.easing!"
                        :values="SliceAnimationBreakpoints.EASINGS"
                        ariaLabel="Easing"
                        @change="(easing: SliceAnimationEasing) => setBreakpointOpts({ easing })"
                    />
                </PageProp>

                <PageProp item-key="smoothness01" v-bind="CellAnimationKnobs.SMOOTHNESS01_TEXT">
                    <PageNumberField
                        :value="breakpointOpts.smoothness!"
                        :min="CellAnimationKnobs.MIN_SMOOTHNESS"
                        :max="CellAnimationKnobs.MAX_SMOOTHNESS"
                        :step="CellAnimationKnobs.SMOOTHNESS_STEP"
                        ariaLabel="Smoothness"
                        @input="(value: number) => setBreakpointOpts({ smoothness: value })"
                    />
                </PageProp>

                <PageProp item-key="animationDurationMs" v-bind="CellAnimationKnobs.ANIMATION_DURATION_MS_TEXT">
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
                    v-bind="CellAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT"
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

                <PageProp item-key="animationIterationCount" v-bind="CellAnimationKnobs.ANIMATION_ITERATION_COUNT_TEXT">
                    <PageNumberField
                        :value="animationIterationCount"
                        :min="CellAnimationKnobs.MIN_ITERATION_COUNT"
                        :max="CellAnimationKnobs.MAX_ITERATION_COUNT"
                        :step="CellAnimationKnobs.CELL_COUNT_STEP"
                        ariaLabel="Iteration count"
                        @input="(value: number) => (animationIterationCount = value)"
                    />
                </PageProp>

                <PageProp item-key="finalFrame" v-bind="CellAnimationKnobs.FINAL_FRAME_TEXT">
                    <PageSelectField
                        :value="finalFrame"
                        :values="CELL_ANIMATION_FINAL_FRAMES"
                        :is-disabled="animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT"
                        ariaLabel="Final frame"
                        @change="(frame: CellAnimationFinalFrame) => (finalFrame = frame)"
                    />
                </PageProp>

                <PageProp item-key="playbackDir" v-bind="CellAnimationKnobs.PLAYBACK_DIR_TEXT">
                    <PageSelectField
                        :value="playbackOpts.dir!"
                        :values="SliceAnimationPlayback.DIRECTIONS"
                        ariaLabel="Playback direction"
                        @change="(dir: SliceAnimationPlaybackDirection) => setPlaybackOpts({ dir })"
                    />
                </PageProp>

                <PageProp item-key="holdMs" v-bind="CellAnimationKnobs.HOLD_MS_TEXT">
                    <PageNumberField
                        :value="playbackOpts.holdMs!"
                        :min="CellAnimationKnobs.MIN_HOLD_MS"
                        :max="CellAnimationKnobs.MAX_HOLD_MS"
                        :step="CellAnimationKnobs.DURATION_STEP_MS"
                        :is-disabled="!SliceAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)"
                        ariaLabel="Hold at far end"
                        @input="(value: number) => setPlaybackOpts({ holdMs: value })"
                    />
                </PageProp>
            </PagePropsPanel>
        </PagePropsGroups>

        <PageExamples :items="examples" layout="flow">
            <template #source>
                <SourcedExampleWrapper
                    v-bind="commonProps"
                    v-model:playback="sourcedPlayback"
                    v-model:progress="sourcedProgress"
                    :src="sourcedSrc"
                    :is-page-playing="playback"
                    :compute-width="computeSourcedWidth"
                />
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
                <StressTestWrapper
                    v-bind="commonProps"
                    v-model:playback="playback"
                    :src="sourcedSrc"
                    :compute-width="computeSourcedWidth"
                />
            </template>
        </PageExamples>
    </div>
</template>
