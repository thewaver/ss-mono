<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    MediaQueryMonitorVueUtils,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextStrokeAlignment,
    type SVGDefsColors,
    SVGDefsSamples,
} from "@thewaver/ss-components-vue";
import { PaintedTextKnobs } from "@thewaver/ss-playground/App/Knobs/PaintedTexts.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PagePaintPicker from "../../PageComponents/PaintPicker/PagePaintPicker.vue";
import { usePaintSlot } from "../../PageComponents/PaintPicker/PaintPicker.utils";
import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPickerVue.const";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CircleExampleWrapper from "./CircleExampleWrapper.vue";
import CustomInputExampleWrapper from "./CustomInputExampleWrapper.vue";
import ScrambledExample from "./Examples/Scrambled.vue";
import HeadingExampleWrapper from "./HeadingExampleWrapper.vue";
import type { PaintedTextExampleWrapperProps } from "./PaintedTextPageVue.types";
import ParagraphExampleWrapper from "./ParagraphExampleWrapper.vue";
import TypedExampleWrapper from "./TypedExampleWrapper.vue";
import WaveExampleWrapper from "./WaveExampleWrapper.vue";

const fill = usePaintSlot(PaintedTextKnobs.STARTING_FILL_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);
const stroke = usePaintSlot(PaintedTextKnobs.STARTING_STROKE_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);

const width = shallowRef(PaintedTextKnobs.STARTING_WIDTH);
const strokeWidth = shallowRef(PAINTED_TEXT_DEFAULTS.strokeWidth);
const strokeAlignment = shallowRef<PaintedTextStrokeAlignment>(PAINTED_TEXT_DEFAULTS.strokeAlignment);
const blurWidth = shallowRef(PaintedTextKnobs.STARTING_BLUR_WIDTH);
const animationDurationMs = shallowRef(PaintedTextKnobs.STARTING_DURATION_MS);
const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(PaintedTextKnobs.STARTING_ITERATION_KEY);
const cellSize = shallowRef(PaintedTextKnobs.STARTING_CELL_SIZE);
const colors = shallowRef<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const circleProgress = shallowRef(0);
const isCirclePlaying = shallowRef(!prefersReducedMotion.value);
const waveProgress = shallowRef(0);
const isWavePlaying = shallowRef(!prefersReducedMotion.value);

const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

const colorKeys = computed(() => Object.keys(colors.value) as (keyof SVGDefsColors)[]);

const usesPattern = computed(() =>
    getIsUsingKind([fill.paint.value, stroke.paint.value], ["pattern", "tracked_pattern"]),
);
const usesTiming = computed(() => getIsUsingKind([fill.paint.value, stroke.paint.value], ["pattern", "timed"]));

const commonProps = computed((): PaintedTextExampleWrapperProps => ({
    width: width.value,
    fillPaint: fill.paint.value,
    strokePaint: stroke.paint.value,
    strokeWidth: strokeWidth.value,
    strokeAlignment: strokeAlignment.value,
    colors: colors.value,
    blurWidth: blurWidth.value,
    animationDurationMs: animationDurationMs.value,
    iterationConfigKey: iterationConfigKey.value,
    cellSize: { width: cellSize.value, height: cellSize.value },
}));

const setColor = (key: keyof SVGDefsColors, value: string) => {
    colors.value = { ...colors.value, [key]: value };
};

const examples: ExampleDefs[] = [
    {
        key: "heading",
        name: EXAMPLE_NAMES.heading,
        path: `${EXAMPLES_ROOT}/Heading.vue`,
    },
    {
        key: "paragraph",
        name: EXAMPLE_NAMES.paragraph,
        readout: () =>
            "the text wraps where Typewriter would wrap it, the paint is sized to the whole block so one gradient runs across every line, and the image, the icon and the link are carried into the drawing",
        path: `${EXAMPLES_ROOT}/Paragraph.vue`,
    },
    {
        key: "customInput",
        name: EXAMPLE_NAMES.customInput,
        readout: () =>
            "the text box drives the painted text directly: every change to what it holds is laid out and painted again, line breaks included",
        path: `${EXAMPLES_ROOT}/CustomInput.vue`,
    },
    {
        key: "typed",
        name: EXAMPLE_NAMES.typed,
        readout: () =>
            "a Typewriter around two painted texts: it decides when each letter arrives and how, the painted texts decide where the letters sit and what paints them, and the two share one run in reading order",
        path: `${EXAMPLES_ROOT}/Typed.vue`,
    },
    {
        key: "scrambled",
        name: EXAMPLE_NAMES.scrambled,
        readout: () =>
            "a ScrambleText around a painted text: it decides which glyph each letter shows while it churns, and the painted text draws that glyph, painted, in the letter's place",
        path: `${EXAMPLES_ROOT}/Scrambled.vue`,
    },
    {
        key: "circle",
        name: EXAMPLE_NAMES.circle,
        readout: () =>
            `${getPercent(circleProgress.value)} round the circle, ${isCirclePlaying.value ? "turning" : "stopped"} — the browser sets every letter along the path, the paint runs across the ring as one, and what slides past the end comes round from the start`,
        path: `${EXAMPLES_ROOT}/Circle.vue`,
    },
    {
        key: "wave",
        name: EXAMPLE_NAMES.wave,
        readout: () =>
            `${getPercent(waveProgress.value)} along the wave, ${isWavePlaying.value ? "sliding" : "stopped"} — any path will do, and on an open one the text leaves at the far end as it comes back in at the near one`,
        path: `${EXAMPLES_ROOT}/Wave.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsGroups>
            <PagePaintPicker
                :paint-slot="fill"
                name="fill"
                label="Fill"
                hint="What paints the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer. For hollow letters, paint them solid and make the background color transparent."
                prop-path="PaintedTextProps.computeFillDefs"
            />

            <PagePropsDivider />

            <PagePaintPicker
                :paint-slot="stroke"
                name="stroke"
                label="Stroke"
                hint="What paints the stroke around the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
                prop-path="PaintedTextProps.computeStrokeDefs"
            />

            <PagePropsDivider />

            <PagePropsPanel scope="global">
                <PageProp
                    item-key="strokeWidth"
                    controls="Sets PaintedTextProps.strokeWidth"
                    label="Stroke width (px)"
                    hint="How wide the stroke appears, whichever side of the letter's edge it sits on."
                >
                    <PageNumberField
                        :value="strokeWidth"
                        :min="PaintedTextKnobs.MIN_STROKE_WIDTH"
                        :max="PaintedTextKnobs.MAX_STROKE_WIDTH"
                        :step="PaintedTextKnobs.STROKE_WIDTH_STEP"
                        ariaLabel="Stroke width in pixels"
                        @input="(value: number) => (strokeWidth = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="strokeAlignment"
                    controls="Sets PaintedTextProps.strokeAlignment"
                    label="Stroke alignment"
                    hint="Where the stroke sits against the edge of each letter: outside keeps the letters their full shape, inside keeps the text its overall size, and center straddles the edge."
                >
                    <PageSelectField
                        :value="strokeAlignment"
                        :values="PaintedTextKnobs.STROKE_ALIGNMENTS"
                        ariaLabel="Stroke alignment"
                        @change="(value) => (strokeAlignment = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="colors"
                    controls="Sets the colors of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs"
                    label="Colors"
                    hint="The colors the fill and the stroke are built from. Each sample uses as many as it needs."
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

                <PageProp
                    item-key="blurWidth"
                    controls="Sets the blur of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs"
                    label="Blur (px)"
                    hint="How far the paint is blurred outward, which is what gives it its glow."
                >
                    <PageNumberField
                        :value="blurWidth"
                        :min="PaintedTextKnobs.MIN_BLUR_WIDTH"
                        :max="PaintedTextKnobs.MAX_BLUR_WIDTH"
                        :step="PaintedTextKnobs.BLUR_WIDTH_STEP"
                        ariaLabel="Blur width"
                        @input="(value: number) => (blurWidth = value)"
                    />
                </PageProp>

                <PageProp
                    v-if="usesTiming"
                    item-key="animationDurationMs"
                    controls="Sets the duration of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs"
                    label="Animation duration (ms)"
                    hint="How long one pass of the fill or stroke animation takes."
                >
                    <PageNumberField
                        :value="animationDurationMs"
                        :min="PaintedTextKnobs.MIN_DURATION_MS"
                        :max="PaintedTextKnobs.MAX_DURATION_MS"
                        :step="PaintedTextKnobs.DURATION_STEP_MS"
                        ariaLabel="Animation duration"
                        @input="(value: number) => (animationDurationMs = value)"
                    />
                </PageProp>

                <PageProp
                    v-if="usesTiming"
                    item-key="iterationConfigKey"
                    controls="Picks how the example paints repeat, sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs"
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

                <PageProp
                    v-if="usesPattern"
                    item-key="cellSize"
                    controls="Sets the tile size of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs"
                    label="Pattern Cell Size (px)"
                    hint="How large one tile of a pattern is before it repeats."
                >
                    <PageNumberField
                        :value="cellSize"
                        :min="PaintedTextKnobs.MIN_CELL_SIZE"
                        :max="PaintedTextKnobs.MAX_CELL_SIZE"
                        :step="PaintedTextKnobs.CELL_SIZE_STEP"
                        ariaLabel="Pattern cell size"
                        @input="(value: number) => (cellSize = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="width"
                    :controls="EXAMPLES_ONLY_PROP"
                    label="Container width (px)"
                    hint="How wide the box holding the text is, which decides where the lines wrap."
                >
                    <PageNumberField
                        :value="width"
                        :min="PaintedTextKnobs.MIN_CONTAINER_WIDTH"
                        :max="PaintedTextKnobs.MAX_CONTAINER_WIDTH"
                        :step="PaintedTextKnobs.CONTAINER_WIDTH_STEP"
                        ariaLabel="Container width in pixels"
                        @input="(value: number) => (width = value)"
                    />
                </PageProp>
            </PagePropsPanel>
        </PagePropsGroups>

        <PageExamples :items="examples" layout="flow">
            <template #heading>
                <HeadingExampleWrapper v-bind="commonProps" />
            </template>

            <template #paragraph>
                <ParagraphExampleWrapper v-bind="commonProps" />
            </template>

            <template #customInput>
                <CustomInputExampleWrapper v-bind="commonProps" />
            </template>

            <template #typed>
                <TypedExampleWrapper v-bind="commonProps" />
            </template>

            <template #scrambled>
                <ScrambledExample v-bind="commonProps" />
            </template>

            <template #circle>
                <CircleExampleWrapper
                    v-bind="commonProps"
                    v-model:progress="circleProgress"
                    v-model:playback="isCirclePlaying"
                />
            </template>

            <template #wave>
                <WaveExampleWrapper
                    v-bind="commonProps"
                    v-model:progress="waveProgress"
                    v-model:playback="isWavePlaying"
                />
            </template>
        </PageExamples>
    </div>
</template>
