<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { LightCatcherKnobs } from "@thewaver/ss-playground/App/Knobs/LightCatchers.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    ROW_SPAN,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PanelExample from "./Examples/Panel.vue";
import PlacedLightExample from "./Examples/PlacedLight.vue";
import RowExample from "./Examples/Row.vue";
import type { LightCatcherExampleProps } from "./LightCatcherPageVue.types";

const isDisabled = shallowRef(LightCatcherKnobs.STARTING_IS_DISABLED);
const smoothingMs = shallowRef(LIGHT_CATCHER_DEFAULTS.smoothingMs);
const activeRangePx = shallowRef(LightCatcherKnobs.STARTING_ACTIVE_RANGE_PX);
const lightRangePx = shallowRef(LIGHT_CATCHER_DEFAULTS.lightRangePx);
const maxBrightness = shallowRef(LIGHT_CATCHER_DEFAULTS.maxBrightness);
const restingBrightness = shallowRef(LIGHT_CATCHER_DEFAULTS.restingBrightness);
const maxLightness = shallowRef(LIGHT_CATCHER_DEFAULTS.maxLightness);
const restingLightness = shallowRef(LIGHT_CATCHER_DEFAULTS.restingLightness);

const commonProps = computed<LightCatcherExampleProps>(() => ({
    isDisabled: isDisabled.value,
    activeRangePx: activeRangePx.value,
    smoothingMs: smoothingMs.value,
    lightRangePx: lightRangePx.value,
    maxBrightness: maxBrightness.value,
    restingBrightness: restingBrightness.value,
    maxLightness: maxLightness.value,
    restingLightness: restingLightness.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "panel",
        name: EXAMPLE_NAMES.panel,
        readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "row",
        name: EXAMPLE_NAMES.row,
        span: ROW_SPAN,
        readout: () =>
            "five of them side by side, each reading the pointer against its own box — drop the resting brightness below 1 and the row becomes a spotlight",
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "placed",
        name: EXAMPLE_NAMES.placed,
        span: ROW_SPAN,
        readout: () =>
            "the slider puts one light across the whole row and every lamp answers to that same spot — the pointer is ignored, since a supplied point replaces it",
        path: `${EXAMPLES_ROOT}/PlacedLight.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="isDisabled" v-bind="LightCatcherKnobs.IS_DISABLED_TEXT">
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp item-key="smoothingMs" v-bind="LightCatcherKnobs.SMOOTHING_MS_TEXT">
            <PageNumberField
                :value="smoothingMs"
                :min="LightCatcherKnobs.MIN_SMOOTHING_MS"
                :max="LightCatcherKnobs.MAX_SMOOTHING_MS"
                :step="LightCatcherKnobs.SMOOTHING_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Smoothing in milliseconds"
                @input="(value: number) => (smoothingMs = value)"
            />
        </PageProp>

        <PageProp item-key="activeRangePx" v-bind="LightCatcherKnobs.ACTIVE_RANGE_PX_TEXT">
            <PageNumberField
                :value="activeRangePx"
                :min="LightCatcherKnobs.MIN_ACTIVE_RANGE_PX"
                :max="LightCatcherKnobs.MAX_ACTIVE_RANGE_PX"
                :step="LightCatcherKnobs.ACTIVE_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Active range in pixels"
                @input="(value: number) => (activeRangePx = value)"
            />
        </PageProp>

        <PageProp item-key="lightRangePx" v-bind="LightCatcherKnobs.LIGHT_RANGE_PX_TEXT">
            <PageNumberField
                :value="lightRangePx"
                :min="LightCatcherKnobs.MIN_LIGHT_RANGE_PX"
                :max="LightCatcherKnobs.MAX_LIGHT_RANGE_PX"
                :step="LightCatcherKnobs.LIGHT_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Light range in pixels"
                @input="(value: number) => (lightRangePx = value)"
            />
        </PageProp>

        <PageProp item-key="maxBrightness" v-bind="LightCatcherKnobs.MAX_BRIGHTNESS_TEXT">
            <PageNumberField
                :value="maxBrightness"
                :min="LightCatcherKnobs.MIN_BRIGHTNESS"
                :max="LightCatcherKnobs.MAX_BRIGHTNESS"
                :step="LightCatcherKnobs.BRIGHTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Maximum brightness"
                @input="(value: number) => (maxBrightness = value)"
            />
        </PageProp>

        <PageProp item-key="restingBrightness" v-bind="LightCatcherKnobs.RESTING_BRIGHTNESS_TEXT">
            <PageNumberField
                :value="restingBrightness"
                :min="LightCatcherKnobs.MIN_BRIGHTNESS"
                :max="LightCatcherKnobs.MAX_BRIGHTNESS"
                :step="LightCatcherKnobs.BRIGHTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Resting brightness"
                @input="(value: number) => (restingBrightness = value)"
            />
        </PageProp>

        <PageProp item-key="maxLightness" v-bind="LightCatcherKnobs.MAX_LIGHTNESS_TEXT">
            <PageNumberField
                :value="maxLightness"
                :min="LightCatcherKnobs.MIN_LIGHTNESS"
                :max="LightCatcherKnobs.MAX_LIGHTNESS"
                :step="LightCatcherKnobs.LIGHTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Maximum lightness"
                @input="(value: number) => (maxLightness = value)"
            />
        </PageProp>

        <PageProp item-key="restingLightness" v-bind="LightCatcherKnobs.RESTING_LIGHTNESS_TEXT">
            <PageNumberField
                :value="restingLightness"
                :min="LightCatcherKnobs.MIN_LIGHTNESS"
                :max="LightCatcherKnobs.MAX_LIGHTNESS"
                :step="LightCatcherKnobs.LIGHTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Resting lightness"
                @input="(value: number) => (restingLightness = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #panel>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <PanelExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #row>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <RowExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #placed>
            <PlacedLightExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
