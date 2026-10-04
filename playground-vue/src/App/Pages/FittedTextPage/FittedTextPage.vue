<script setup lang="ts">
import { shallowRef } from "vue";

import { FITTED_TEXT_DEFAULTS } from "@thewaver/ss-components-vue";
import { FittedTextKnobs } from "@thewaver/ss-playground/App/Knobs/FittedTexts.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PosterExample from "./Examples/Poster.vue";
import StackExample from "./Examples/Stack.vue";

const EXAMPLES_ROOT = "/src/App/Pages/FittedTextPage/Examples";

const WIDE_SPAN = 2;

const lineHeightRatio = shallowRef(FITTED_TEXT_DEFAULTS.lineHeightRatio);

const examples: ExampleDefs[] = [
    {
        key: "poster",
        name: "A poster",
        span: WIDE_SPAN,
        readout: () =>
            "every line is scaled to the full width, then the stack shrinks as one until it fits the height, so the shortest line comes out the largest; resize the window and it fits again",
        path: `${EXAMPLES_ROOT}/Poster.vue`,
    },
    {
        key: "stack",
        name: "A narrow box",
        readout: () =>
            "in a box this narrow the width runs out before the height does, so nothing has to shrink to fit and the lines keep their full-width sizes",
        path: `${EXAMPLES_ROOT}/Stack.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="lineHeightRatio"
            label="Line height"
            hint="Each line's height as a multiple of its own font size, which is the room the stack is fitted with."
        >
            <PageNumberField
                :value="lineHeightRatio"
                :min="FittedTextKnobs.MIN_LINE_HEIGHT_RATIO"
                :max="FittedTextKnobs.MAX_LINE_HEIGHT_RATIO"
                :step="FittedTextKnobs.LINE_HEIGHT_RATIO_STEP"
                ariaLabel="Line height"
                @input="(value: number) => (lineHeightRatio = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #poster>
            <PosterExample :line-height-ratio="lineHeightRatio" />
        </template>

        <template #stack>
            <StackExample :line-height-ratio="lineHeightRatio" />
        </template>
    </PageExamples>
</template>
