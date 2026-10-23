<script setup lang="ts">
import { shallowRef } from "vue";

import { SLIDE_BUTTON_DEFAULTS } from "@thewaver/ss-components-vue";
import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import DescribedExample from "./Examples/Described.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import HeldExample from "./Examples/Held.vue";
import HoldOnlyExample from "./Examples/HoldOnly.vue";
import ReachableExample from "./Examples/Reachable.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import SlideOnlyExample from "./Examples/SlideOnly.vue";
import VerticalExample from "./Examples/Vertical.vue";

const sends = shallowRef(0);
const progress = shallowRef(0);
const completionRatio = shallowRef(SLIDE_BUTTON_DEFAULTS.completionRatio);
const isArmed = shallowRef(false);
const describedSends = shallowRef(0);
const disabledSends = shallowRef(0);
const reachableSends = shallowRef(0);
const hasError = shallowRef(true);
const slideOnlySends = shallowRef(0);
const holdOnlySends = shallowRef(0);
const verticalSends = shallowRef(0);
const rightToLeftSends = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `activations: ${sends.value} — progress ${Math.round(progress.value * PERCENT)}%, which the owner reads while the gesture is still running`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "described",
        name: EXAMPLE_NAMES.described,
        readout: () =>
            `activations: ${describedSends.value} — the hint under the control is what a screen reader reads after its name, so the gesture is stated before anyone has to guess it`,
        path: `${EXAMPLES_ROOT}/Described.vue`,
    },
    {
        key: "slideOnly",
        name: EXAMPLE_NAMES.slideOnly,
        readout: () =>
            `activations: ${slideOnlySends.value} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
        path: `${EXAMPLES_ROOT}/SlideOnly.vue`,
    },
    {
        key: "holdOnly",
        name: EXAMPLE_NAMES.holdOnly,
        readout: () =>
            `activations: ${holdOnlySends.value} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
        path: `${EXAMPLES_ROOT}/HoldOnly.vue`,
    },
    {
        key: "vertical",
        name: EXAMPLE_NAMES.vertical,
        readout: () =>
            `activations: ${verticalSends.value} — the thumb rests at the bottom and slides up, and a held press or a held Enter fill it the same way`,
        path: `${EXAMPLES_ROOT}/Vertical.vue`,
    },
    {
        key: "rightToLeft",
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `activations: ${rightToLeftSends.value} — the box around the button sets dir="rtl", so the thumb rests at the right and slides leftward`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "held",
        name: EXAMPLE_NAMES.held,
        readout: () => `armed: ${isArmed.value}`,
        path: `${EXAMPLES_ROOT}/Held.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () => `activations: ${disabledSends.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: EXAMPLE_NAMES.reachable,
        readout: () => `activations: ${reachableSends.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: EXAMPLE_NAMES.errored,
        readout: () => `hasError: ${hasError.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="completionRatio"
            controls="Sets SlideButtonProps.completionRatio on the default example"
            label="Completion ratio"
            hint="How far along the track the thumb has to be when let go for the slide to complete. At 1 it has to reach the end; short of it, it springs back."
        >
            <PageNumberField
                :value="completionRatio"
                :min="SlideButtonKnobs.MIN_COMPLETION_RATIO"
                :max="SlideButtonKnobs.MAX_COMPLETION_RATIO"
                :step="SlideButtonKnobs.COMPLETION_RATIO_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Completion ratio"
                @input="(value: number) => (completionRatio = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <div :class="styles.stage">
                <DefaultExample v-model:progress="progress" :completion-ratio="completionRatio" @activate="sends++" />
            </div>
        </template>

        <template #described>
            <DescribedExample @activate="describedSends++" />
        </template>

        <template #slideOnly>
            <div :class="styles.stage">
                <SlideOnlyExample @activate="slideOnlySends++" />
            </div>
        </template>

        <template #holdOnly>
            <div :class="styles.stage">
                <HoldOnlyExample @activate="holdOnlySends++" />
            </div>
        </template>

        <template #vertical>
            <div :class="styles.stage">
                <VerticalExample @activate="verticalSends++" />
            </div>
        </template>

        <template #rightToLeft>
            <div :class="styles.stage">
                <RightToLeftExample @activate="rightToLeftSends++" />
            </div>
        </template>

        <template #held>
            <div :class="styles.stage">
                <HeldExample :is-armed="isArmed" @activate="isArmed = true" @reset="isArmed = false" />
            </div>
        </template>

        <template #disabled>
            <div :class="styles.stage">
                <DisabledExample @activate="disabledSends++" />
            </div>
        </template>

        <template #reachable>
            <div :class="styles.stage">
                <ReachableExample @activate="reachableSends++" />
            </div>
        </template>

        <template #errored>
            <div :class="styles.stage">
                <ErroredExample :has-error="hasError" @activate="hasError = !hasError" />
            </div>
        </template>
    </PageExamples>
</template>
