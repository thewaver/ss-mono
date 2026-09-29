<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGDefsSamples } from "@thewaver/ss-components-vue";
import {
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatternsPage/SVGPatternsPage.css";

import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import type { SVGPatternsExampleProps } from "./SVGPatternsPage.types";

const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);
const PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatternsPage/Examples/Default.vue";

const configKey = shallowRef<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(SVGPatternKnobs.STARTING_PATTERN_KEY);
const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(SVGPatternKnobs.STARTING_ITERATION_KEY);
const animationDurationMs = shallowRef(SVGPatternKnobs.STARTING_DURATION_MS);
const cellSize = shallowRef(SVGPatternKnobs.STARTING_CELL_SIZE);
const blurWidth = shallowRef(SVGPatternKnobs.STARTING_BLUR_WIDTH);
const colors = shallowRef({ ...SVGDefsSamples.SAMPLE_COLORS });

const cellSize2d = computed(() => ({ width: cellSize.value, height: cellSize.value }));

const colorKeys = computed(() => Object.keys(colors.value) as (keyof typeof colors.value)[]);

const commonProps = computed<SVGPatternsExampleProps>(() => ({
    configKey: configKey.value,
    iterationConfigKey: iterationConfigKey.value,
    animationDurationMs: animationDurationMs.value,
    colors: colors.value,
    cellSize: cellSize2d.value,
    blurWidth: blurWidth.value,
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
                :groups="PATTERN_GROUPS"
                ariaLabel="Pattern"
                @change="(config: WithNoSample<SVGDefsSamples.Pattern.SampleKey>) => (configKey = config)"
            />
        </PageProp>

        <PageProp
            item-key="cellSize"
            label="Cell Size (px)"
            hint="How large one tile of the pattern is before it repeats."
        >
            <PageNumberField
                :value="cellSize"
                :min="SVGPatternKnobs.MIN_CELL_SIZE"
                :max="SVGPatternKnobs.MAX_CELL_SIZE"
                :step="SVGPatternKnobs.CELL_SIZE_STEP"
                ariaLabel="Cell size"
                @input="(value: number) => (cellSize = value)"
            />
        </PageProp>

        <PageProp
            item-key="colors"
            label="Colors"
            hint="The colors the pattern is drawn from. Each sample uses as many of them as it needs."
        >
            <div :class="styles.colorList">
                <PageColorField
                    v-for="key in colorKeys"
                    :key="key"
                    :value="colors[key]"
                    :ariaLabel="key"
                    @input="(value: string) => (colors = { ...colors, [key]: value })"
                />
            </div>
        </PageProp>

        <PageProp
            item-key="blurWidth"
            label="Blur (px)"
            hint="How far the pattern is blurred outward, which is what gives it its glow."
        >
            <PageNumberField
                :value="blurWidth"
                :min="SVGPatternKnobs.MIN_BLUR_WIDTH"
                :max="SVGPatternKnobs.MAX_BLUR_WIDTH"
                :step="SVGPatternKnobs.BLUR_WIDTH_STEP"
                ariaLabel="Blur width"
                @input="(value: number) => (blurWidth = value)"
            />
        </PageProp>

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
