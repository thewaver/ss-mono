<script setup lang="ts">
import { shallowRef } from "vue";

import { TextAreaKnobs } from "@thewaver/ss-playground/App/Knobs/TextAreas.const";
import { DOCS_ROOT, DOCS_SECTIONS, MAX_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import GrowingDocsExample from "./Docs/Growing.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const maxRows = shallowRef(MAX_ROWS);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="TextAreaKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="TextAreaKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TextAreaKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.growingWithTyping" />

    <PageDocsExample :path="`${DOCS_ROOT}/Growing.vue`">
        <GrowingDocsExample :max-rows="maxRows" />

        <template #renderKnobs>
            <PageProp item-key="maxRows" v-bind="TextAreaKnobs.MAX_ROWS_TEXT">
                <PageNumberField
                    :value="maxRows"
                    :min="TextAreaKnobs.MIN_MAX_ROWS"
                    :max="TextAreaKnobs.MAX_MAX_ROWS"
                    :step="TextAreaKnobs.MAX_ROWS_STEP"
                    ariaLabel="Max rows"
                    @input="(value: number) => (maxRows = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="TextAreaKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="TextAreaKnobs.IS_DISABLED_TEXT">
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
