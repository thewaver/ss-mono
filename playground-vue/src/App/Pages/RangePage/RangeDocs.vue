<script setup lang="ts">
import { shallowRef } from "vue";

import type { RangeOrientation } from "@thewaver/ss-components-vue";
import { RANGE_DEFAULTS, RANGE_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { RangeKnobs } from "@thewaver/ss-playground/App/Knobs/Ranges.const";
import {
    DIFFICULTY_MAX,
    DIFFICULTY_MIN,
    DIFFICULTY_STEP,
    DOCS_ROOT,
} from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import KnobDocsExample from "./Docs/Knob.vue";
import PairDocsExample from "./Docs/Pair.vue";
import PricesDocsExample from "./Docs/Prices.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SteppingDocsExample from "./Docs/Stepping.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const KNOB_CONTENT =
    'Pass [prop]computeValueAtPoint[/prop] and the range follows the pointer itself, asking that function which value a point on the control stands for. RangeUtils.computeAngularValue answers by the point\'s angle round the center, which turns the slider into a knob. A press sets the value at once, so turning it never needs a drag ([wcag id="2.5.7"]WCAG 2.5.7[/wcag]), and the arrow keys still step it.';

const orientation = shallowRef<RangeOrientation>(RANGE_DEFAULTS.orientation);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const min = shallowRef(DIFFICULTY_MIN);
const max = shallowRef(DIFFICULTY_MAX);
const step = shallowRef(DIFFICULTY_STEP);
const isPairDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the track runs across the page or up it. Upright, the lowest value is at the bottom."
                controls="Sets RangeProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="RANGE_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: RangeOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the range invalid, for screen readers as well as for the painter."
                controls="Sets RangeProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the range off: neither dragging nor the arrow keys move it, and the Tab key skips it."
                controls="Sets RangeProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Stepping and limits"
        content="A thumb sits between [prop]min[/prop] and [prop]max[/prop] and moves in steps of [prop]step[/prop], counted from the minimum. The arrow keys move it one step, Home and End take it to either end, and a drag lands on the same steps."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Stepping.vue`">
        <SteppingDocsExample :min="min" :max="max" :step="step" />

        <template #renderKnobs>
            <PageProp
                item-key="min"
                label="Min"
                hint="The lowest value a thumb can take."
                controls="Sets RangeProps.min"
            >
                <PageNumberField
                    :value="min"
                    :min="RangeKnobs.MIN_LIMIT"
                    :max="RangeKnobs.MAX_LIMIT"
                    :step="RangeKnobs.LIMIT_STEP"
                    ariaLabel="Min"
                    @input="(value: number) => (min = value)"
                />
            </PageProp>

            <PageProp
                item-key="max"
                label="Max"
                hint="The highest value a thumb can take."
                controls="Sets RangeProps.max"
            >
                <PageNumberField
                    :value="max"
                    :min="RangeKnobs.MIN_LIMIT"
                    :max="RangeKnobs.MAX_LIMIT"
                    :step="RangeKnobs.LIMIT_STEP"
                    ariaLabel="Max"
                    @input="(value: number) => (max = value)"
                />
            </PageProp>

            <PageProp
                item-key="step"
                label="Step"
                hint="How far one press of an arrow key moves a thumb, and the spacing a drag snaps to."
                controls="Sets RangeProps.step"
            >
                <PageNumberField
                    :value="step"
                    :min="RangeKnobs.MIN_STEP"
                    :max="RangeKnobs.MAX_STEP"
                    :step="RangeKnobs.STEP_STEP"
                    ariaLabel="Step"
                    @input="(value: number) => (step = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Two thumbs"
        content="Hand it [prop]range[/prop], a start and an end, in place of [prop]value[/prop], and it draws two thumbs over one track. Each thumb is a slider of its own, named by its entry in [prop]thumbLabels[/prop] and with its own stop for the Tab key, and neither can pass the other. Turned off, both thumbs leave the tab order."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Pair.vue`">
        <PairDocsExample :is-disabled="isPairDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="pairIsDisabled"
                label="Disabled"
                hint="Turns the range off: neither thumb moves, and the Tab key skips both."
                controls="Sets RangeProps.isDisabled"
            >
                <PageCheckField
                    :value="isPairDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isPairDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the track runs from the right: the lowest value is at the right end, so the thumb for the start of the range sits to the right of the one for its end, and the left arrow key raises a thumb's value rather than lowering it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Read as prices"
        content="A screen reader reads a thumb's bare number unless you pass [prop]computeValueText[/prop], which turns a value into the words to read instead, here a price. It is handed the value and which thumb holds it. Separately, [prop]onChangeEnd[/prop] runs once a change is finished, when a drag lets go or after each key press, for work that should not run on every step of a drag."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Prices.vue`">
        <PricesDocsExample />
    </PageDocsExample>

    <PageDocsSection title="Drawn as a knob" :content="KNOB_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Knob.vue`">
        <KnobDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a range [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the range's description. A disabled range shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and neither the arrow keys nor a drag move it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled range's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled range shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets RangeProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp
                item-key="tooltipIsDisabled"
                label="Disabled"
                hint="Turns the range off: neither dragging nor the arrow keys move it, and the Tab key skips it."
                controls="Sets RangeProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
