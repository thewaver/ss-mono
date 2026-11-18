<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    GERMAN_LOCALE,
    NUMBER_LOCALES,
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import LocaleDocsExample from "./Docs/Locale.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SteppingDocsExample from "./Docs/Stepping.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import UnitDocsExample from "./Docs/Unit.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const min = shallowRef(QUANTITY_MIN);
const max = shallowRef(QUANTITY_MAX);
const step = shallowRef(QUANTITY_STEP);
const locale = shallowRef(GERMAN_LOCALE);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="NumberInputKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="NumberInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="NumberInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.steppingLimits" />

    <PageDocsExample :path="`${DOCS_ROOT}/Stepping.vue`">
        <SteppingDocsExample :min="min" :max="max" :step="step" />

        <template #renderKnobs>
            <PageProp item-key="min" v-bind="NumberInputKnobs.MIN_TEXT">
                <PageNumberField
                    :value="min"
                    :min="NumberInputKnobs.MIN_LIMIT"
                    :max="NumberInputKnobs.MAX_LIMIT"
                    :step="NumberInputKnobs.LIMIT_STEP"
                    ariaLabel="Min"
                    @input="(value: number) => (min = value)"
                />
            </PageProp>

            <PageProp item-key="max" v-bind="NumberInputKnobs.MAX_TEXT">
                <PageNumberField
                    :value="max"
                    :min="NumberInputKnobs.MIN_LIMIT"
                    :max="NumberInputKnobs.MAX_LIMIT"
                    :step="NumberInputKnobs.LIMIT_STEP"
                    ariaLabel="Max"
                    @input="(value: number) => (max = value)"
                />
            </PageProp>

            <PageProp item-key="step" v-bind="NumberInputKnobs.STEP_TEXT">
                <PageNumberField
                    :value="step"
                    :min="NumberInputKnobs.MIN_STEP"
                    :max="NumberInputKnobs.MAX_STEP"
                    :step="NumberInputKnobs.STEP_STEP"
                    ariaLabel="Step"
                    @input="(value: number) => (step = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.numbersWrittenLocalWay" />

    <PageDocsExample :path="`${DOCS_ROOT}/Locale.vue`">
        <LocaleDocsExample :locale="locale" />

        <template #renderKnobs>
            <PageProp item-key="locale" v-bind="NumberInputKnobs.LOCALE_TEXT">
                <PageSelectField
                    :value="locale"
                    :values="NUMBER_LOCALES"
                    ariaLabel="Locale"
                    @change="(value: string) => (locale = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.unitBesideStepper" />

    <PageDocsExample :path="`${DOCS_ROOT}/Unit.vue`">
        <UnitDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="NumberInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="NumberInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.namedLabel" />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
