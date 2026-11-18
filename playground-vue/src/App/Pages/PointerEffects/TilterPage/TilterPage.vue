<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TILTER_DEFAULTS } from "@thewaver/ss-components-vue";
import { TilterKnobs } from "@thewaver/ss-playground/App/Knobs/Tilters.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CardExample from "./Examples/Card.vue";
import PhotoExample from "./Examples/Photo.vue";
import type { TilterExampleProps } from "./TilterPageVue.types";

const isDisabled = shallowRef(TilterKnobs.STARTING_IS_DISABLED);
const smoothingMs = shallowRef(TILTER_DEFAULTS.smoothingMs);
const activeRangePx = shallowRef(TilterKnobs.STARTING_ACTIVE_RANGE_PX);
const tiltRangePx = shallowRef(TILTER_DEFAULTS.tiltRangePx);
const maxTiltDegrees = shallowRef(TILTER_DEFAULTS.maxTiltDegrees);
const perspectivePx = shallowRef(TILTER_DEFAULTS.perspectivePx);
const sheenOpacity = shallowRef(TilterKnobs.STARTING_SHEEN_OPACITY);
const sheenSpreadPercent = shallowRef(TilterKnobs.STARTING_SHEEN_SPREAD);

const commonProps = computed<TilterExampleProps>(() => ({
    isDisabled: isDisabled.value,
    activeRangePx: activeRangePx.value,
    smoothingMs: smoothingMs.value,
    tiltRangePx: tiltRangePx.value,
    maxTiltDegrees: maxTiltDegrees.value,
    perspectivePx: perspectivePx.value,
    sheenOpacity: sheenOpacity.value,
    sheenSpreadPercent: sheenSpreadPercent.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "card",
        name: EXAMPLE_NAMES.card,
        readout: () =>
            "the surface leans away from the pointer and the highlight runs the other way, which is what reads as a reflection",
        path: `${EXAMPLES_ROOT}/Card.vue`,
    },
    {
        key: "photo",
        name: EXAMPLE_NAMES.photo,
        readout: () => "the same wrapper with the sheen slot left out — nothing is painted over the content",
        path: `${EXAMPLES_ROOT}/Photo.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="isDisabled" v-bind="TilterKnobs.IS_DISABLED_TEXT">
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp item-key="smoothingMs" v-bind="TilterKnobs.SMOOTHING_MS_TEXT">
            <PageNumberField
                :value="smoothingMs"
                :min="TilterKnobs.MIN_SMOOTHING_MS"
                :max="TilterKnobs.MAX_SMOOTHING_MS"
                :step="TilterKnobs.SMOOTHING_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Smoothing in milliseconds"
                @input="(value: number) => (smoothingMs = value)"
            />
        </PageProp>

        <PageProp item-key="activeRangePx" v-bind="TilterKnobs.ACTIVE_RANGE_PX_TEXT">
            <PageNumberField
                :value="activeRangePx"
                :min="TilterKnobs.MIN_ACTIVE_RANGE_PX"
                :max="TilterKnobs.MAX_ACTIVE_RANGE_PX"
                :step="TilterKnobs.ACTIVE_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Active range in pixels"
                @input="(value: number) => (activeRangePx = value)"
            />
        </PageProp>

        <PageProp item-key="tiltRangePx" v-bind="TilterKnobs.TILT_RANGE_PX_TEXT">
            <PageNumberField
                :value="tiltRangePx"
                :min="TilterKnobs.MIN_TILT_RANGE_PX"
                :max="TilterKnobs.MAX_TILT_RANGE_PX"
                :step="TilterKnobs.TILT_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Tilt range in pixels"
                @input="(value: number) => (tiltRangePx = value)"
            />
        </PageProp>

        <PageProp item-key="maxTiltDegrees" v-bind="TilterKnobs.MAX_TILT_DEGREES_TEXT">
            <PageNumberField
                :value="maxTiltDegrees"
                :min="TilterKnobs.MIN_TILT_DEGREES"
                :max="TilterKnobs.MAX_TILT_DEGREES"
                :step="TilterKnobs.TILT_STEP_DEGREES"
                :width="FIELD_WIDTH"
                ariaLabel="Maximum tilt in degrees"
                @input="(value: number) => (maxTiltDegrees = value)"
            />
        </PageProp>

        <PageProp item-key="perspectivePx" v-bind="TilterKnobs.PERSPECTIVE_PX_TEXT">
            <PageNumberField
                :value="perspectivePx"
                :min="TilterKnobs.MIN_PERSPECTIVE_PX"
                :max="TilterKnobs.MAX_PERSPECTIVE_PX"
                :step="TilterKnobs.PERSPECTIVE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Perspective in pixels"
                @input="(value: number) => (perspectivePx = value)"
            />
        </PageProp>

        <PageProp item-key="sheenOpacity" v-bind="TilterKnobs.SHEEN_OPACITY_TEXT">
            <PageNumberField
                :value="sheenOpacity"
                :min="TilterKnobs.MIN_SHEEN_OPACITY"
                :max="TilterKnobs.MAX_SHEEN_OPACITY"
                :step="TilterKnobs.SHEEN_OPACITY_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Sheen opacity"
                @input="(value: number) => (sheenOpacity = value)"
            />
        </PageProp>

        <PageProp item-key="sheenSpreadPercent" v-bind="TilterKnobs.SHEEN_SPREAD_PERCENT_TEXT">
            <PageNumberField
                :value="sheenSpreadPercent"
                :min="TilterKnobs.MIN_SHEEN_SPREAD"
                :max="TilterKnobs.MAX_SHEEN_SPREAD"
                :step="TilterKnobs.SHEEN_SPREAD_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Sheen spread in percent"
                @input="(value: number) => (sheenSpreadPercent = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #card>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <CardExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #photo>
            <PageMeasureBox is-filling :height="BOX_HEIGHT">
                <PhotoExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>
    </PageExamples>
</template>
