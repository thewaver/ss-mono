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
    DOCS_SECTIONS,
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
            <PageProp item-key="orientation" v-bind="RangeKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="RANGE_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: RangeOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="RangeKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="RangeKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.steppingLimits" />

    <PageDocsExample :path="`${DOCS_ROOT}/Stepping.vue`">
        <SteppingDocsExample :min="min" :max="max" :step="step" />

        <template #renderKnobs>
            <PageProp item-key="min" v-bind="RangeKnobs.MIN_TEXT">
                <PageNumberField
                    :value="min"
                    :min="RangeKnobs.MIN_LIMIT"
                    :max="RangeKnobs.MAX_LIMIT"
                    :step="RangeKnobs.LIMIT_STEP"
                    ariaLabel="Min"
                    @input="(value: number) => (min = value)"
                />
            </PageProp>

            <PageProp item-key="max" v-bind="RangeKnobs.MAX_TEXT">
                <PageNumberField
                    :value="max"
                    :min="RangeKnobs.MIN_LIMIT"
                    :max="RangeKnobs.MAX_LIMIT"
                    :step="RangeKnobs.LIMIT_STEP"
                    ariaLabel="Max"
                    @input="(value: number) => (max = value)"
                />
            </PageProp>

            <PageProp item-key="step" v-bind="RangeKnobs.STEP_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.twoThumbs" />

    <PageDocsExample :path="`${DOCS_ROOT}/Pair.vue`">
        <PairDocsExample :is-disabled="isPairDisabled" />

        <template #renderKnobs>
            <PageProp item-key="pairIsDisabled" v-bind="RangeKnobs.PAIR_IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isPairDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isPairDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.readPrices" />

    <PageDocsExample :path="`${DOCS_ROOT}/Prices.vue`">
        <PricesDocsExample />
    </PageDocsExample>

    <PageDocsSection title="Drawn as a knob" :content="KNOB_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Knob.vue`">
        <KnobDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="RangeKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="RangeKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
