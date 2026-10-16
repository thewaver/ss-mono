<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { RGB_SPLITTER_DEFAULTS } from "@thewaver/ss-components-vue";
import { RGBSplitterKnobs } from "@thewaver/ss-playground/App/Knobs/RGBSplitters.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import HeadlineExample from "./Examples/Headline.vue";
import PhotoExample from "./Examples/Photo.vue";
import type { RGBSplitterExampleProps } from "./RGBSplitterPageVue.types";

type ColorMixingChoice = (typeof RGBSplitterKnobs.COLOR_MIXING_CHOICES)[number];

const isDisabled = shallowRef(RGBSplitterKnobs.STARTING_IS_DISABLED);
const smoothingMs = shallowRef(RGB_SPLITTER_DEFAULTS.smoothingMs);
const activeRangePx = shallowRef(RGBSplitterKnobs.STARTING_ACTIVE_RANGE_PX);
const splitRangePx = shallowRef(RGB_SPLITTER_DEFAULTS.splitRangePx);
const maxOffsetPx = shallowRef(RGB_SPLITTER_DEFAULTS.maxOffsetPx);
const colorMixingChoice = shallowRef<ColorMixingChoice>(RGBSplitterKnobs.FROM_COLOR_SCHEME);

const commonProps = computed<RGBSplitterExampleProps>(() => ({
    isDisabled: isDisabled.value,
    activeRangePx: activeRangePx.value,
    smoothingMs: smoothingMs.value,
    splitRangePx: splitRangePx.value,
    maxOffsetPx: maxOffsetPx.value,
    colorMixing: colorMixingChoice.value === RGBSplitterKnobs.FROM_COLOR_SCHEME ? undefined : colorMixingChoice.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "photo",
        name: EXAMPLE_NAMES.photo,
        readout: () =>
            "the channels pull apart as the pointer heads for the middle — leave and come back, and each takes a new direction",
        path: `${EXAMPLES_ROOT}/Photo.vue`,
    },
    {
        key: "headline",
        name: EXAMPLE_NAMES.headline,
        readout: () => "type on a transparent ground, so the fringes fall straight onto the page",
        path: `${EXAMPLES_ROOT}/Headline.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Stops the content answering the pointer and leaves it whole. It is what a page honoring a reduced-motion preference passes."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="smoothingMs"
            label="Smoothing (ms)"
            hint="How long the split takes to catch up with the pointer. At 0 it follows exactly; raised, the channels glide apart and back together."
        >
            <PageNumberField
                :value="smoothingMs"
                :min="RGBSplitterKnobs.MIN_SMOOTHING_MS"
                :max="RGBSplitterKnobs.MAX_SMOOTHING_MS"
                :step="RGBSplitterKnobs.SMOOTHING_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Smoothing in milliseconds"
                @input="(value: number) => (smoothingMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="activeRangePx"
            label="Active range (px)"
            hint="How near the pointer has to be before the content answers it at all, measured from its center. Outside it the content stays whole."
        >
            <PageNumberField
                :value="activeRangePx"
                :min="RGBSplitterKnobs.MIN_ACTIVE_RANGE_PX"
                :max="RGBSplitterKnobs.MAX_ACTIVE_RANGE_PX"
                :step="RGBSplitterKnobs.ACTIVE_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Active range in pixels"
                @input="(value: number) => (activeRangePx = value)"
            />
        </PageProp>

        <PageProp
            item-key="splitRangePx"
            label="Split range (px)"
            hint="How far the split reaches. Widest with the pointer on the center, closed out here."
        >
            <PageNumberField
                :value="splitRangePx"
                :min="RGBSplitterKnobs.MIN_SPLIT_RANGE_PX"
                :max="RGBSplitterKnobs.MAX_SPLIT_RANGE_PX"
                :step="RGBSplitterKnobs.SPLIT_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Split range in pixels"
                @input="(value: number) => (splitRangePx = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxOffsetPx"
            label="Max offset (px)"
            hint="The furthest any one channel is shifted, with the pointer on the center. Each channel picks a random direction and distance within it every time the split opens."
        >
            <PageNumberField
                :value="maxOffsetPx"
                :min="RGBSplitterKnobs.MIN_OFFSET_PX"
                :max="RGBSplitterKnobs.MAX_OFFSET_PX"
                :step="RGBSplitterKnobs.OFFSET_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Maximum offset in pixels"
                @input="(value: number) => (maxOffsetPx = value)"
            />
        </PageProp>

        <PageProp
            item-key="colorMixing"
            label="Color mixing"
            hint="How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme each time the split opens."
        >
            <PageSelectField
                :value="colorMixingChoice"
                :values="RGBSplitterKnobs.COLOR_MIXING_CHOICES"
                ariaLabel="Color mixing"
                @change="(value: ColorMixingChoice) => (colorMixingChoice = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #photo>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <PhotoExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #headline>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <HeadlineExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>
    </PageExamples>
</template>
