<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import { SVGDefsSamples, TimedGradientDefaults } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import { TimedGradientKnobs } from "../../Knobs/TimedGradients.const";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExampleWrapper from "./DefaultExampleWrapper.vue";
import MorphExampleWrapper from "./MorphExampleWrapper.vue";
import type { ShapeExampleProps } from "./ShapePage.types";
import StressTestWrapper from "./StressTestWrapper.vue";
import TextWrapExampleWrapper from "./TextWrapExampleWrapper.vue";

const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);
const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);

const STROKE_GROUPS = toGroupEntriesWithNoSample(GROUPPED_GRADIENTS);
const FILL_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";
const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.vue`;

const blurWidth = shallowRef(ShapeKnobs.STARTING_BLUR_WIDTH);
const animationDurationMs = shallowRef(ShapeKnobs.STARTING_DURATION_MS);
const edgeThickness = shallowRef(ShapeKnobs.STARTING_EDGE_THICKNESS);
const strokeConfigKey = shallowRef<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
    ShapeKnobs.STARTING_GRADIENT_KEY,
);
const strokeConfigDefsByKey = shallowRef<Record<string, Record<string, number | boolean>>>({});

const strokeKnobs = computed(() =>
    strokeConfigKey.value === NO_SAMPLE_KEY
        ? {}
        : (TimedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey.value] as Record<string, Knob>),
);
const strokeDefaults = computed(() =>
    strokeConfigKey.value === NO_SAMPLE_KEY
        ? {}
        : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey.value] as Record<string, unknown>),
);
const strokeConfigDefs = computed(() => strokeConfigDefsByKey.value[strokeConfigKey.value] ?? {});

const fillConfigKey = shallowRef<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(NO_SAMPLE_KEY);
const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(ShapeKnobs.STARTING_ITERATION_KEY);
const cellSize = shallowRef(ShapeKnobs.STARTING_CELL_SIZE);
const colors = shallowRef<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

const colorKeys = computed(() => Object.keys(colors.value) as (keyof SVGDefsColors)[]);

const commonProps = computed(
    (): ShapeExampleProps => ({
        shouldClipChildren: ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
        shouldPadChildren: ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
        blurWidth: blurWidth.value,
        animationDurationMs: animationDurationMs.value,
        colors: colors.value,
        shapeKind: ShapeKnobs.STARTING_SHAPE_KIND,
        strokeConfigKey: strokeConfigKey.value,
        strokeConfigDefs: strokeConfigDefs.value,
        fillConfigKey: fillConfigKey.value,
        iterationConfigKey: iterationConfigKey.value,
        cellSize: { width: cellSize.value, height: cellSize.value },
        edgeThicknesses: [edgeThickness.value],
        joinRadii: ShapeKnobs.STARTING_JOIN_RADII,
        lameExponents: ShapeKnobs.STARTING_LAME_EXPONENTS,
    }),
);

const setStrokeConfigDef = (key: string, value: number | boolean) => {
    const previous = strokeConfigDefsByKey.value;

    strokeConfigDefsByKey.value = {
        ...previous,
        [strokeConfigKey.value]: { ...previous[strokeConfigKey.value], [key]: value },
    };
};

const setColor = (key: keyof SVGDefsColors, value: string) => {
    colors.value = { ...colors.value, [key]: value };
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        path: DEFAULT_EXAMPLE_PATH,
    },
    {
        key: "morph",
        name: "Morph",
        readout: () =>
            "one number from 0 to 1 is read inside computePoints and blends two outlines of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
        path: `${EXAMPLES_ROOT}/Morph.vue`,
    },
    {
        key: "textWrap",
        name: "Text Wrap",
        readout: () =>
            "the shape writes its outline as shape-outside, so floating it is all the page does for the text to follow the edge",
        path: `${EXAMPLES_ROOT}/TextWrap.vue`,
    },
    {
        key: "stressTest",
        name: "Stress Test",
    },
];
</script>

<template>
    <div :class="styles.root" :style="assignInlineVars({ [styles.backgroundColor]: colors.background })">
        <PagePropsGroups>
            <PagePropsPanel scope="sample">
                <PageProp
                    item-key="strokeConfigKey"
                    label="Stroke Pattern"
                    hint="Which animated gradient paints the shape's outline. Choosing one brings its own knobs with it."
                >
                    <PageGroupedSelectField
                        :value="strokeConfigKey"
                        :groups="STROKE_GROUPS"
                        ariaLabel="Stroke pattern"
                        @change="(value) => (strokeConfigKey = value)"
                    />
                </PageProp>

                <PageKnobs
                    :knobs="strokeKnobs"
                    :defaults="strokeDefaults"
                    :values="strokeConfigDefs"
                    @input="setStrokeConfigDef"
                />
            </PagePropsPanel>

            <PagePropsDivider />

            <PagePropsPanel scope="global">
                <PageProp
                    item-key="fillConfigKey"
                    label="Fill Pattern"
                    hint="Which repeating pattern fills the shape's inside. Choosing one brings its own knobs with it."
                >
                    <PageGroupedSelectField
                        :value="fillConfigKey"
                        :groups="FILL_GROUPS"
                        ariaLabel="Fill pattern"
                        @change="(value) => (fillConfigKey = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="cellSize"
                    label="Fill Cell Size (px)"
                    hint="How large one tile of the fill pattern is before it repeats."
                >
                    <PageNumberField
                        :value="cellSize"
                        :min="ShapeKnobs.MIN_CELL_SIZE"
                        :max="ShapeKnobs.MAX_CELL_SIZE"
                        :step="ShapeKnobs.CELL_SIZE_STEP"
                        ariaLabel="Fill cell size"
                        @input="(value: number) => (cellSize = value)"
                    />
                </PageProp>
                <PageProp
                    item-key="colors"
                    label="Colors"
                    hint="The colors the outline, the fill and the page's own background are painted from."
                >
                    <div :class="styles.colorList">
                        <PageColorField
                            v-for="key in colorKeys"
                            :key="key"
                            :value="colors[key]"
                            :ariaLabel="key"
                            @input="(value: string) => setColor(key, value)"
                        />
                    </div>
                </PageProp>

                <PageProp item-key="edgeThicknessPx" label="Edge Thickness (px)" hint="How thick the outline is.">
                    <PageNumberField
                        :value="edgeThickness"
                        :min="ShapeKnobs.MIN_EDGE_THICKNESS"
                        :max="ShapeKnobs.MAX_EDGE_THICKNESS"
                        :step="ShapeKnobs.EDGE_THICKNESS_STEP"
                        ariaLabel="Edge thickness"
                        @input="(value: number) => (edgeThickness = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="blurWidth"
                    label="Blur (px)"
                    hint="How far the outline is blurred outward, which is what gives it its glow."
                >
                    <PageNumberField
                        :value="blurWidth"
                        :min="ShapeKnobs.MIN_BLUR_WIDTH"
                        :max="ShapeKnobs.MAX_BLUR_WIDTH"
                        :step="ShapeKnobs.BLUR_WIDTH_STEP"
                        ariaLabel="Blur width"
                        @input="(value: number) => (blurWidth = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="animationDurationMs"
                    label="Animation duration (ms)"
                    hint="How long one pass of the stroke or fill animation takes."
                >
                    <PageNumberField
                        :value="animationDurationMs"
                        :min="ShapeKnobs.MIN_DURATION_MS"
                        :max="ShapeKnobs.MAX_DURATION_MS"
                        :step="ShapeKnobs.DURATION_STEP_MS"
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
                        @change="(value) => (iterationConfigKey = value)"
                    />
                </PageProp>
            </PagePropsPanel>
        </PagePropsGroups>

        <PageExamples :items="examples" layout="flow">
            <template #default>
                <DefaultExampleWrapper v-bind="commonProps" />
            </template>

            <template #morph>
                <MorphExampleWrapper v-bind="commonProps" />
            </template>

            <template #textWrap>
                <TextWrapExampleWrapper v-bind="commonProps" />
            </template>

            <template #stressTest>
                <StressTestWrapper v-bind="commonProps" />
            </template>
        </PageExamples>
    </div>
</template>
