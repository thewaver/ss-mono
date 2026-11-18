<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { LENS_DEFAULTS } from "@thewaver/ss-components-vue";
import { LensKnobs } from "@thewaver/ss-playground/App/Knobs/Lenses.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SHAPE_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.const";
import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PhotoExample from "./Examples/Photo.vue";
import PrintExample from "./Examples/Print.vue";
import type { LensExampleProps } from "./LensPage.types";

const zoom = shallowRef(LENS_DEFAULTS.zoom);
const radius = shallowRef(LENS_DEFAULTS.radius);
const shape = shallowRef<RevealShape>(LensKnobs.STARTING_SHAPE);
const joinRadius = shallowRef(LensKnobs.STARTING_JOIN_RADIUS);
const lameExponent = shallowRef(LensKnobs.STARTING_LAME_EXPONENT);
const softness = shallowRef(LENS_DEFAULTS.softness);
const stepSize = shallowRef(LENS_DEFAULTS.stepSize);
const isDisabled = shallowRef(LensKnobs.STARTING_IS_DISABLED);

const computePoints = computed(() => {
    const picked = shape.value;

    return (size: Size2d) => ShapeConst.getDefaultShapePoints(picked, size);
});

const joinRadii = computed(() => [joinRadius.value]);
const lameExponents = computed(() => [lameExponent.value]);

const commonProps = computed<LensExampleProps>(() => ({
    zoom: zoom.value,
    radius: radius.value,
    softness: softness.value,
    stepSize: stepSize.value,
    joinRadii: joinRadii.value,
    lameExponents: lameExponents.value,
    isDisabled: isDisabled.value,
    computePoints: computePoints.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "photo",
        name: EXAMPLE_NAMES.photo,
        readout: () => "a picture drawn larger inside a window that follows the pointer",
        path: `${EXAMPLES_ROOT}/Photo.vue`,
    },
    {
        key: "print",
        name: EXAMPLE_NAMES.print,
        readout: () => "the word under the middle of the lens is the word under the pointer",
        path: `${EXAMPLES_ROOT}/Print.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="zoom" v-bind="LensKnobs.ZOOM_TEXT">
            <PageNumberField
                :value="zoom"
                :min="LensKnobs.MIN_ZOOM"
                :max="LensKnobs.MAX_ZOOM"
                :step="LensKnobs.ZOOM_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Zoom"
                @input="(value: number) => (zoom = value)"
            />
        </PageProp>

        <PageProp item-key="radius" v-bind="LensKnobs.RADIUS_TEXT">
            <PageNumberField
                :value="radius"
                :min="LensKnobs.MIN_RADIUS"
                :max="LensKnobs.MAX_RADIUS"
                :step="LensKnobs.RADIUS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Radius"
                @input="(value: number) => (radius = value)"
            />
        </PageProp>

        <PageProp item-key="computePoints" v-bind="LensKnobs.COMPUTE_POINTS_TEXT">
            <PageSelectField
                :value="shape"
                :values="LensKnobs.SHAPES"
                :width="SHAPE_FIELD_WIDTH"
                ariaLabel="Shape"
                @change="(next: RevealShape) => (shape = next)"
            />
        </PageProp>

        <PageProp item-key="joinRadii" v-bind="LensKnobs.JOIN_RADII_TEXT">
            <PageNumberField
                :value="joinRadius"
                :min="LensKnobs.MIN_JOIN_RADIUS"
                :max="LensKnobs.MAX_JOIN_RADIUS"
                :step="LensKnobs.JOIN_RADIUS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Corner radius"
                @input="(value: number) => (joinRadius = value)"
            />
        </PageProp>

        <PageProp item-key="lameExponents" v-bind="LensKnobs.LAME_EXPONENTS_TEXT">
            <PageNumberField
                :value="lameExponent"
                :min="LensKnobs.MIN_LAME_EXPONENT"
                :max="LensKnobs.MAX_LAME_EXPONENT"
                :step="LensKnobs.LAME_EXPONENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Corner style"
                @input="(value: number) => (lameExponent = value)"
            />
        </PageProp>

        <PageProp item-key="softness" v-bind="LensKnobs.SOFTNESS_TEXT">
            <PageNumberField
                :value="softness"
                :min="LensKnobs.MIN_SOFTNESS"
                :max="LensKnobs.MAX_SOFTNESS"
                :step="LensKnobs.SOFTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Softness"
                @input="(value: number) => (softness = value)"
            />
        </PageProp>

        <PageProp item-key="stepSize" v-bind="LensKnobs.STEP_SIZE_TEXT">
            <PageNumberField
                :value="stepSize"
                :min="LensKnobs.MIN_STEP_SIZE"
                :max="LensKnobs.MAX_STEP_SIZE"
                :step="LensKnobs.STEP_SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Step size in pixels"
                @input="(value: number) => (stepSize = value)"
            />
        </PageProp>

        <PageProp item-key="isDisabled" v-bind="LensKnobs.IS_DISABLED_TEXT">
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #photo>
            <PhotoExample v-bind="commonProps" />
        </template>

        <template #print>
            <PrintExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
