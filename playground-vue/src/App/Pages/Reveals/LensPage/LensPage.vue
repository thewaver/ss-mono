<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { LENS_DEFAULTS } from "@thewaver/ss-components-vue";
import { LensKnobs } from "@thewaver/ss-playground/App/Knobs/Lenses.const";
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

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/LensPage/Examples";
const FIELD_WIDTH = 110;
const SHAPE_FIELD_WIDTH = 170;

const zoom = shallowRef(LENS_DEFAULTS.zoom);
const radius = shallowRef(LENS_DEFAULTS.radius);
const shape = shallowRef<RevealShape>(LensKnobs.STARTING_SHAPE);
const joinRadius = shallowRef(LensKnobs.STARTING_JOIN_RADIUS);
const lameExponent = shallowRef(LensKnobs.STARTING_LAME_EXPONENT);
const softness = shallowRef(LENS_DEFAULTS.softness);
const stepSize = shallowRef(LENS_DEFAULTS.stepSize);
const isDisabled = shallowRef(LensKnobs.STARTING_IS_DISABLED);

const isCircle = computed(() => shape.value === LensKnobs.CIRCLE);

const computePoints = computed(() => {
    const picked = shape.value;

    if (picked === LensKnobs.CIRCLE) return undefined;

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
        name: "Photo",
        readout: () => "a picture drawn larger inside a window that follows the pointer",
        path: `${EXAMPLES_ROOT}/Photo.vue`,
    },
    {
        key: "print",
        name: "Small print",
        readout: () => "the word under the middle of the lens is the word under the pointer",
        path: `${EXAMPLES_ROOT}/Print.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="zoom"
            label="Zoom"
            hint="How many times larger the content is drawn inside the lens. 1 draws it at its own size."
        >
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

        <PageProp item-key="radius" label="Radius (px)" hint="How large the lens that follows the pointer is.">
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

        <PageProp item-key="computePoints" label="Shape" hint="The contour of the lens.">
            <PageSelectField
                :value="shape"
                :values="LensKnobs.SHAPES"
                :width="SHAPE_FIELD_WIDTH"
                ariaLabel="Shape"
                @change="(next: RevealShape) => (shape = next)"
            />
        </PageProp>

        <PageProp
            item-key="joinRadii"
            label="Corner radius (px)"
            hint="How far the lens's corners are rounded. A circular lens has no corners, so it is off then."
        >
            <PageNumberField
                :value="joinRadius"
                :min="LensKnobs.MIN_JOIN_RADIUS"
                :max="LensKnobs.MAX_JOIN_RADIUS"
                :step="LensKnobs.JOIN_RADIUS_STEP"
                :width="FIELD_WIDTH"
                :is-disabled="isCircle"
                ariaLabel="Corner radius"
                @input="(value: number) => (joinRadius = value)"
            />
        </PageProp>

        <PageProp
            item-key="lameExponents"
            label="Lamé Exponent"
            hint="How square or how pinched the lens's rounded corners are: 2 is a circular round, higher is squarer."
        >
            <PageNumberField
                :value="lameExponent"
                :min="LensKnobs.MIN_LAME_EXPONENT"
                :max="LensKnobs.MAX_LAME_EXPONENT"
                :step="LensKnobs.LAME_EXPONENT_STEP"
                :width="FIELD_WIDTH"
                :is-disabled="isCircle"
                ariaLabel="Corner style"
                @input="(value: number) => (lameExponent = value)"
            />
        </PageProp>

        <PageProp
            item-key="softness"
            label="Softness"
            hint="How gradually the lens's edge fades into the content around it. 1 gives a hard edge."
        >
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

        <PageProp
            item-key="stepSize"
            label="Step size (px)"
            hint="How far one press of an arrow key moves the lens. Tab to a lens and it opens at the center; the arrow keys move it from there."
        >
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

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Stops the lens following the pointer or the keyboard, leaving the content as it is."
        >
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
