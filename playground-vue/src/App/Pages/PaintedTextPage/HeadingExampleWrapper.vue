<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import HeadingExample from "./Examples/Heading.vue";
import type { PaintedTextExampleProps, PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

const props = defineProps<PaintedTextExampleWrapperProps>();

const fontSize = shallowRef(PaintedTextKnobs.STARTING_FONT_SIZE);
const lineHeight = shallowRef(PaintedTextKnobs.STARTING_LINE_HEIGHT);
const fontWeight = shallowRef(PaintedTextKnobs.STARTING_FONT_WEIGHT);

const exampleProps = computed((): PaintedTextExampleProps => {
    const { width: _width, ...rest } = props;

    return rest;
});
</script>

<template>
    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <HeadingExample
            v-bind="exampleProps"
            :font-size="fontSize"
            :line-height="lineHeight"
            :font-weight="fontWeight"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp item-key="fontSize" label="Font size (px)" hint="How large the letters are.">
            <PageNumberField
                :value="fontSize"
                :min="PaintedTextKnobs.MIN_FONT_SIZE"
                :max="PaintedTextKnobs.MAX_FONT_SIZE"
                :step="PaintedTextKnobs.FONT_SIZE_STEP"
                ariaLabel="Font size in pixels"
                @input="(value: number) => (fontSize = value)"
            />
        </PageProp>

        <PageProp
            item-key="lineHeight"
            label="Line height"
            hint="How tall each line is, as a multiple of the font size, which decides how far apart the lines sit."
        >
            <PageNumberField
                :value="lineHeight"
                :min="PaintedTextKnobs.MIN_LINE_HEIGHT"
                :max="PaintedTextKnobs.MAX_LINE_HEIGHT"
                :step="PaintedTextKnobs.LINE_HEIGHT_STEP"
                ariaLabel="Line height"
                @input="(value: number) => (lineHeight = value)"
            />
        </PageProp>

        <PageProp item-key="fontWeight" label="Font weight" hint="How heavy the letters are, from 100 to 900.">
            <PageNumberField
                :value="fontWeight"
                :min="PaintedTextKnobs.MIN_FONT_WEIGHT"
                :max="PaintedTextKnobs.MAX_FONT_WEIGHT"
                :step="PaintedTextKnobs.FONT_WEIGHT_STEP"
                ariaLabel="Font weight"
                @input="(value: number) => (fontWeight = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
