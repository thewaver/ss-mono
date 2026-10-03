<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import { SVGDefsSamples } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PagePaintPicker from "../../PageComponents/PaintPicker/PagePaintPicker.vue";
import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPicker.const";
import { usePaintSlot } from "../../PageComponents/PaintPicker/PaintPicker.utils";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExampleWrapper from "./DefaultExampleWrapper.vue";
import MorphExampleWrapper from "./MorphExampleWrapper.vue";
import type { ShapeExampleProps } from "./ShapePage.types";
import SharedPaintExampleWrapper from "./SharedPaintExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";
import TextWrapExampleWrapper from "./TextWrapExampleWrapper.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";
const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.vue`;

const blurWidth = shallowRef(ShapeKnobs.STARTING_BLUR_WIDTH);
const animationDurationMs = shallowRef(ShapeKnobs.STARTING_DURATION_MS);
const edgeThickness = shallowRef(ShapeKnobs.STARTING_EDGE_THICKNESS);
const stroke = usePaintSlot(ShapeKnobs.STARTING_STROKE_PAINT_KIND);
const fill = usePaintSlot(ShapeKnobs.STARTING_FILL_PAINT_KIND);

const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(ShapeKnobs.STARTING_ITERATION_KEY);
const cellSize = shallowRef(ShapeKnobs.STARTING_CELL_SIZE);
const colors = shallowRef<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

const colorKeys = computed(() => Object.keys(colors.value) as (keyof SVGDefsColors)[]);

const usesPattern = computed(() =>
    getIsUsingKind([stroke.paint.value, fill.paint.value], ["pattern", "trackedPattern"]),
);
const usesTiming = computed(() => getIsUsingKind([stroke.paint.value, fill.paint.value], ["pattern", "timed"]));

const commonProps = computed((): ShapeExampleProps => ({
    shouldClipChildren: ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
    shouldPadChildren: ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
    blurWidth: blurWidth.value,
    animationDurationMs: animationDurationMs.value,
    colors: colors.value,
    shapeKind: ShapeKnobs.STARTING_SHAPE_KIND,
    strokePaint: stroke.paint.value,
    fillPaint: fill.paint.value,
    iterationConfigKey: iterationConfigKey.value,
    cellSize: { width: cellSize.value, height: cellSize.value },
    edgeThicknesses: [edgeThickness.value],
    joinRadii: ShapeKnobs.STARTING_JOIN_RADII,
    lameExponents: ShapeKnobs.STARTING_LAME_EXPONENTS,
}));

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
            "one number from 0 to 1 is read inside computePoints and blends two contours of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
        path: `${EXAMPLES_ROOT}/Morph.vue`,
    },
    {
        key: "sharedPaint",
        name: "Shared Paint",
        readout: () =>
            "four shapes painted by one fill and one stroke laid across the whole group, so each shows its own part of a single picture; resize any of them and the picture stretches to the new group",
        path: `${EXAMPLES_ROOT}/SharedPaint.vue`,
    },
    {
        key: "textWrap",
        name: "Text Wrap",
        readout: () =>
            "the shape writes its contour as shape-outside, so floating it is all the page does for the text to follow the edge",
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
            <PagePaintPicker
                :paint-slot="stroke"
                name="stroke"
                label="Stroke"
                hint="What paints the shape's stroke: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
            />

            <PagePropsDivider />

            <PagePaintPicker
                :paint-slot="fill"
                name="fill"
                label="Fill"
                hint="What paints the shape's inside: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
            />

            <PagePropsDivider />

            <PagePropsPanel scope="global">
                <PageProp
                    v-if="usesPattern"
                    item-key="cellSize"
                    label="Pattern Cell Size (px)"
                    hint="How large one tile of a pattern is before it repeats."
                >
                    <PageNumberField
                        :value="cellSize"
                        :min="ShapeKnobs.MIN_CELL_SIZE"
                        :max="ShapeKnobs.MAX_CELL_SIZE"
                        :step="ShapeKnobs.CELL_SIZE_STEP"
                        ariaLabel="Pattern cell size"
                        @input="(value: number) => (cellSize = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="colors"
                    label="Colors"
                    hint="The colors the stroke, the fill and the page's own background are painted from."
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

                <PageProp item-key="strokeThicknessPx" label="Stroke Thickness (px)" hint="How thick the stroke is.">
                    <PageNumberField
                        :value="edgeThickness"
                        :min="ShapeKnobs.MIN_EDGE_THICKNESS"
                        :max="ShapeKnobs.MAX_EDGE_THICKNESS"
                        :step="ShapeKnobs.EDGE_THICKNESS_STEP"
                        ariaLabel="Stroke thickness"
                        @input="(value: number) => (edgeThickness = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="blurWidth"
                    label="Blur (px)"
                    hint="How far the stroke is blurred outward, which is what gives it its glow."
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
                    v-if="usesTiming"
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
                    v-if="usesTiming"
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

            <template #sharedPaint>
                <SharedPaintExampleWrapper v-bind="commonProps" />
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
