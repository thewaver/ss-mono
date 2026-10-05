<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { LightCatcherKnobs } from "@thewaver/ss-playground/App/Knobs/LightCatchers.const";

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

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/LightCatcherPage/Examples";

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 200;
const ROW_SPAN = 2;

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
        name: "One panel",
        readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "row",
        name: "A row of them",
        span: ROW_SPAN,
        readout: () =>
            "five of them side by side, each reading the pointer against its own box — drop the resting brightness below 1 and the row becomes a spotlight",
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "placed",
        name: "A light placed by hand",
        span: ROW_SPAN,
        readout: () =>
            "the slider puts one light across the whole row and every lamp answers to that same spot — the pointer is ignored, since a supplied point replaces it",
        path: `${EXAMPLES_ROOT}/PlacedLight.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Stops the surface answering the pointer and leaves it at its resting brightness and lightness. It is what a page honoring a reduced-motion preference passes."
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
            hint="How long the light takes to catch up with the pointer. At 0 it follows exactly; raised, it glows on after the pointer and fades behind it."
        >
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

        <PageProp
            item-key="activeRangePx"
            label="Active range (px)"
            hint="How near the pointer has to be before the surface answers it at all, measured from its center. Outside it the surface sits at resting."
        >
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

        <PageProp
            item-key="lightRangePx"
            label="Light range (px)"
            hint="How far the light reaches. Full brightness at the surface's own edge, resting out here."
        >
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

        <PageProp
            item-key="maxBrightness"
            label="Max brightness"
            hint="How bright the surface is with the pointer on it. 1 is the content exactly as painted."
        >
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

        <PageProp
            item-key="restingBrightness"
            label="Resting brightness"
            hint="How bright the surface is with nothing near it. Below 1 it dims, which turns a row into a spotlight."
        >
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

        <PageProp
            item-key="maxLightness"
            label="Max lightness"
            hint="How far the surface fades toward white with the pointer on it. 0 is untouched. Unlike brightness it lifts the dark parts most, and the two stack."
        >
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

        <PageProp
            item-key="restingLightness"
            label="Resting lightness"
            hint="How far the surface fades toward white with nothing near it. 0 is untouched."
        >
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
