<script setup lang="ts">
import { shallowRef } from "vue";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-vue";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import {
    BUDGET_MAX,
    DOCS_ROOT,
    DOCS_SECTIONS,
    LOCALE_FIELD_WIDTH,
    LOCALE_GROUPING,
} from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import LocaleDocsExample from "./Docs/Locale.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SignedDocsExample from "./Docs/Signed.vue";
import SymbolDocsExample from "./Docs/Symbol.vue";

const describeGrouping = (sizes: number[] | undefined) =>
    sizes === undefined ? LOCALE_GROUPING : sizes.join(" then ");

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const locale = shallowRef(CurrencyInputKnobs.STARTING_LOCALE);
const decimals = shallowRef(CURRENCY_INPUT_DEFAULTS.decimals);
const grouping = shallowRef<number[] | undefined>();
const max = shallowRef(BUDGET_MAX);
const hasSign = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="CurrencyInputKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="CurrencyInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="CurrencyInputKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.writtenLocalWay" />

    <PageDocsExample :path="`${DOCS_ROOT}/Locale.vue`">
        <LocaleDocsExample :locale="locale" :decimals="decimals" :group-sizes="grouping" />

        <template #renderKnobs>
            <PageProp item-key="locale" v-bind="CurrencyInputKnobs.LOCALE_TEXT">
                <PageSelectField
                    :value="locale"
                    :values="CurrencyInputKnobs.LOCALES"
                    :width="LOCALE_FIELD_WIDTH"
                    ariaLabel="Locale"
                    @change="(value: string) => (locale = value)"
                />
            </PageProp>

            <PageProp item-key="decimals" v-bind="CurrencyInputKnobs.DECIMALS_TEXT">
                <PageSelectField
                    :value="decimals"
                    :values="CurrencyInputKnobs.DECIMALS"
                    ariaLabel="Decimals"
                    @change="(value: number) => (decimals = value)"
                />
            </PageProp>

            <PageProp item-key="groupSizes" v-bind="CurrencyInputKnobs.GROUP_SIZES_TEXT">
                <PageSelectField
                    :value="grouping"
                    :values="CurrencyInputKnobs.GROUPINGS"
                    :compute-label="describeGrouping"
                    ariaLabel="Grouping"
                    @change="(value: number[] | undefined) => (grouping = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.symbol" />

    <PageDocsExample :path="`${DOCS_ROOT}/Symbol.vue`">
        <SymbolDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.limit" />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample :max="max" />

        <template #renderKnobs>
            <PageProp item-key="max" v-bind="CurrencyInputKnobs.MAX_TEXT">
                <PageNumberField
                    :value="max"
                    :min="CurrencyInputKnobs.MIN_MAX"
                    :max="CurrencyInputKnobs.MAX_MAX"
                    :step="CurrencyInputKnobs.MAX_STEP"
                    ariaLabel="Max"
                    @input="(value: number) => (max = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.negativeAmounts" />

    <PageDocsExample :path="`${DOCS_ROOT}/Signed.vue`">
        <SignedDocsExample :has-sign="hasSign" />

        <template #renderKnobs>
            <PageProp item-key="hasSign" v-bind="CurrencyInputKnobs.HAS_SIGN_TEXT">
                <PageCheckField :value="hasSign" ariaLabel="Signed" @change="(value: boolean) => (hasSign = value)" />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
