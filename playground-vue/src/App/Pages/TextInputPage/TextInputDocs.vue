<script setup lang="ts">
import { shallowRef } from "vue";

import { TextInputKnobs } from "@thewaver/ss-playground/App/Knobs/TextInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AdornmentsDocsExample from "./Docs/Adornments.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import EditableDocsExample from "./Docs/Editable.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import NumberDocsExample from "./Docs/Number.vue";
import PasswordDocsExample from "./Docs/Password.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import RewritingDocsExample from "./Docs/Rewriting.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SuggestionsDocsExample from "./Docs/Suggestions.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="TextInputKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="TextInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TextInputKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.rewritingWhatTyped" />

    <PageDocsExample :path="`${DOCS_ROOT}/Rewriting.vue`">
        <RewritingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.refusingWhatTyped" />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.leadingTrailingContent" />

    <PageDocsExample :path="`${DOCS_ROOT}/Adornments.vue`">
        <AdornmentsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.passwords" />

    <PageDocsExample :path="`${DOCS_ROOT}/Password.vue`">
        <PasswordDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.numbers" />

    <PageDocsExample :path="`${DOCS_ROOT}/Number.vue`">
        <NumberDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.suggestions" />

    <PageDocsExample :path="`${DOCS_ROOT}/Suggestions.vue`">
        <SuggestionsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="TextInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="TextInputKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.editingPlace" />

    <PageDocsExample :path="`${DOCS_ROOT}/Editable.vue`">
        <EditableDocsExample />
    </PageDocsExample>
</template>
