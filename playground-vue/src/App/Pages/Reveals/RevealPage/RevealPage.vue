<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
import { RevealKnobs } from "@thewaver/ss-playground/App/Knobs/Reveals.const";
import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import FrostedExample from "./Examples/Frosted.vue";
import PromptExample from "./Examples/Prompt.vue";
import TorchExample from "./Examples/Torch.vue";
import type { RevealExampleProps } from "./RevealExample.types";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/RevealPage/Examples";
const FIELD_WIDTH = 110;
const SHAPE_FIELD_WIDTH = 170;

const radius = shallowRef(REVEAL_DEFAULTS.radius);
const shape = shallowRef<RevealShape>(RevealKnobs.STARTING_SHAPE);
const joinRadius = shallowRef(RevealKnobs.STARTING_JOIN_RADIUS);
const lameExponent = shallowRef(RevealKnobs.STARTING_LAME_EXPONENT);
const softness = shallowRef(REVEAL_DEFAULTS.softness);
const stepSize = shallowRef(REVEAL_DEFAULTS.stepSize);
const isDisabled = shallowRef(RevealKnobs.STARTING_IS_DISABLED);

const isCircle = computed(() => shape.value === RevealKnobs.CIRCLE);

const computePoints = computed(() => {
    const picked = shape.value;

    if (picked === RevealKnobs.CIRCLE) return undefined;

    return (size: Size2d) => ShapeConst.getDefaultShapePoints(picked, size);
});

const joinRadii = computed(() => [joinRadius.value]);
const lameExponents = computed(() => [lameExponent.value]);

const commonProps = computed<RevealExampleProps>(() => ({
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
        key: "torch",
        name: "Torch",
        readout: () => "an opaque cover with a hole cut where the pointer is",
        path: `${EXAMPLES_ROOT}/Torch.vue`,
    },
    {
        key: "frosted",
        name: "Frosted",
        readout: () => "the cover blurs rather than hides, so the hole sharpens instead of uncovering",
        path: `${EXAMPLES_ROOT}/Frosted.vue`,
    },
    {
        key: "prompt",
        name: "Cover that knows",
        readout: () => "the cover is told whether a reveal is happening, and says something different",
        path: `${EXAMPLES_ROOT}/Prompt.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="radius" label="Radius (px)" hint="How large the window that follows the pointer is.">
            <PageNumberField
                :value="radius"
                :min="RevealKnobs.MIN_RADIUS"
                :max="RevealKnobs.MAX_RADIUS"
                :step="RevealKnobs.RADIUS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Radius"
                @input="(value: number) => (radius = value)"
            />
        </PageProp>

        <PageProp item-key="computePoints" label="Shape" hint="The contour of the window that follows the pointer.">
            <PageSelectField
                :value="shape"
                :values="RevealKnobs.SHAPES"
                :width="SHAPE_FIELD_WIDTH"
                ariaLabel="Shape"
                @change="(next: RevealShape) => (shape = next)"
            />
        </PageProp>

        <PageProp
            item-key="joinRadii"
            label="Corner radius (px)"
            hint="How far the window's corners are rounded. A circular window has no corners, so it is off then."
        >
            <PageNumberField
                :value="joinRadius"
                :min="RevealKnobs.MIN_JOIN_RADIUS"
                :max="RevealKnobs.MAX_JOIN_RADIUS"
                :step="RevealKnobs.JOIN_RADIUS_STEP"
                :width="FIELD_WIDTH"
                :is-disabled="isCircle"
                ariaLabel="Corner radius"
                @input="(value: number) => (joinRadius = value)"
            />
        </PageProp>

        <PageProp
            item-key="lameExponents"
            label="Lamé Exponent"
            hint="How square or how pinched the window's rounded corners are: 2 is a circular round, higher is squarer."
        >
            <PageNumberField
                :value="lameExponent"
                :min="RevealKnobs.MIN_LAME_EXPONENT"
                :max="RevealKnobs.MAX_LAME_EXPONENT"
                :step="RevealKnobs.LAME_EXPONENT_STEP"
                :width="FIELD_WIDTH"
                :is-disabled="isCircle"
                ariaLabel="Corner style"
                @input="(value: number) => (lameExponent = value)"
            />
        </PageProp>

        <PageProp
            item-key="softness"
            label="Softness"
            hint="How gradually the window fades into what is still covered. 0 gives a hard edge."
        >
            <PageNumberField
                :value="softness"
                :min="RevealKnobs.MIN_SOFTNESS"
                :max="RevealKnobs.MAX_SOFTNESS"
                :step="RevealKnobs.SOFTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Clear fraction"
                @input="(value: number) => (softness = value)"
            />
        </PageProp>

        <PageProp
            item-key="stepSize"
            label="Step size (px)"
            hint="How far one press of an arrow key moves the window. Tab to a reveal and it opens at the center; the arrow keys move it from there."
        >
            <PageNumberField
                :value="stepSize"
                :min="RevealKnobs.MIN_STEP_SIZE"
                :max="RevealKnobs.MAX_STEP_SIZE"
                :step="RevealKnobs.STEP_SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Step size in pixels"
                @input="(value: number) => (stepSize = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Stops the window following the pointer or the keyboard, leaving whatever is underneath covered."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #torch>
            <TorchExample v-bind="commonProps" />
        </template>

        <template #frosted>
            <FrostedExample v-bind="commonProps" />
        </template>

        <template #prompt>
            <PromptExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
