<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { type SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-vue";
import { toGroupEntriesWithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import { GROUPPED_TIMED_PATTERNS } from "../SVGPatterns.const";
import type { SVGPatternsControls, TimedPatternExampleProps } from "../SVGPatterns.types";
import PageSVGPatternsProps from "../SVGPatternsProps.vue";
import DefaultExample from "./Examples/Default.vue";

const TIMED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TIMED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TimedPatternsPage/Examples/Default.vue";

const configKey = shallowRef<WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>>(
    SVGPatternKnobs.STARTING_TIMED_PATTERN_KEY,
);
const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(SVGPatternKnobs.STARTING_ITERATION_KEY);
const animationDurationMs = shallowRef(SVGPatternKnobs.STARTING_DURATION_MS);
const cellSize = shallowRef(SVGPatternKnobs.STARTING_CELL_SIZE);
const blurWidth = shallowRef(SVGPatternKnobs.STARTING_BLUR_WIDTH);
const colors = shallowRef({ ...SVGDefsSamples.SAMPLE_COLORS });

const cellSize2d = computed(() => ({ width: cellSize.value, height: cellSize.value }));

const commonProps = computed<TimedPatternExampleProps>(() => ({
    configKey: configKey.value,
    iterationConfigKey: iterationConfigKey.value,
    animationDurationMs: animationDurationMs.value,
    colors: colors.value,
    cellSize: cellSize2d.value,
    blurWidth: blurWidth.value,
}));

const controls = computed<SVGPatternsControls>(() => ({
    cellSize,
    blurWidth,
    colors: colors.value,
    setColor: (key: keyof SVGDefsColors, value: string) => {
        colors.value = { ...colors.value, [key]: value };
    },
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        path: DEFAULT_EXAMPLE_PATH,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="configKey" label="Pattern" hint="Which repeating pattern is shown.">
            <PageGroupedSelectField
                :value="configKey"
                :groups="TIMED_PATTERN_GROUPS"
                ariaLabel="Pattern"
                @change="(config: WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>) => (configKey = config)"
            />
        </PageProp>

        <PageSVGPatternsProps :controls="controls" />

        <PageProp
            item-key="animationDurationMs"
            label="Animation duration (ms)"
            hint="How long one pass of the pattern's animation takes."
        >
            <PageNumberField
                :value="animationDurationMs"
                :min="SVGPatternKnobs.MIN_DURATION_MS"
                :max="SVGPatternKnobs.MAX_DURATION_MS"
                :step="SVGPatternKnobs.DURATION_STEP_MS"
                ariaLabel="Animation duration"
                @input="(value: number) => (animationDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="iterationConfigKey"
            label="Iteration Pattern"
            hint="How the animation repeats: once, endlessly, or back and forth."
        >
            <PageSelectField
                :value="iterationConfigKey"
                :values="SVGDefsSamples.Iteration.SAMPLE_KEYS"
                ariaLabel="Iteration pattern"
                @change="(config: SVGDefsSamples.Iteration.SampleKey) => (iterationConfigKey = config)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
