<script setup lang="ts">
import { shallowRef } from "vue";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-vue";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import {
    BUDGET_MAX,
    DOCS_ROOT,
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
            <PageProp
                item-key="isReadOnly"
                label="Read-only"
                hint="Its amount can be selected and copied, but neither typing nor pasting changes it."
                controls="Sets CurrencyInputProps.isReadOnly"
            >
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the field invalid, for screen readers as well as for the painter."
                controls="Sets CurrencyInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets CurrencyInputProps.isDisabled"
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
        title="Right to left"
        content="Inside a box whose text runs right to left, the leading slot, here the symbol, sits on the right and the amount starts beside it, while the digits keep their own order."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Written the local way"
        content="Give it a [prop]locale[/prop] and the amount is written the way that place writes money: which separators, and in which groups. The [prop]decimals[/prop] say how many digits follow the separator, and [prop]groupSizes[/prop] overrides the locale's grouping, such as the Indian pattern of a group of three and then groups of two. However many groups the amount needs, it gets."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Locale.vue`">
        <LocaleDocsExample :locale="locale" :decimals="decimals" :group-sizes="grouping" />

        <template #renderKnobs>
            <PageProp
                item-key="locale"
                label="Locale"
                hint="Which country's conventions the amount is written in, which decides the separators."
                controls="Sets CurrencyInputProps.locale"
            >
                <PageSelectField
                    :value="locale"
                    :values="CurrencyInputKnobs.LOCALES"
                    :width="LOCALE_FIELD_WIDTH"
                    ariaLabel="Locale"
                    @change="(value: string) => (locale = value)"
                />
            </PageProp>

            <PageProp
                item-key="decimals"
                label="Decimals"
                hint="How many digits are kept after the decimal separator."
                controls="Sets CurrencyInputProps.decimals"
            >
                <PageSelectField
                    :value="decimals"
                    :values="CurrencyInputKnobs.DECIMALS"
                    ariaLabel="Decimals"
                    @change="(value: number) => (decimals = value)"
                />
            </PageProp>

            <PageProp
                item-key="groupSizes"
                label="Grouping"
                hint="How the digits before the decimal separator are grouped: the locale's own way, or a pattern such as threes or the Indian lakh."
                controls="Sets CurrencyInputProps.groupSizes"
            >
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

    <PageDocsSection
        title="With a symbol"
        content="The field keeps no list of currencies, so the symbol is yours to draw, in the leading or the trailing slot, on whichever side your locale puts it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Symbol.vue`">
        <SymbolDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A limit"
        content="Give it a [prop]max[/prop] and any amount above it is refused as it is typed, so the field never holds more."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample :max="max" />

        <template #renderKnobs>
            <PageProp
                item-key="max"
                label="Max"
                hint="The largest amount the field accepts."
                controls="Sets CurrencyInputProps.max"
            >
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

    <PageDocsSection
        title="Negative amounts"
        content="With [prop]hasSign[/prop] on, a minus can be typed and the amount can go below zero. Off, the default, a minus is refused."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Signed.vue`">
        <SignedDocsExample :has-sign="hasSign" />

        <template #renderKnobs>
            <PageProp
                item-key="hasSign"
                label="Signed"
                hint="Allows negative amounts to be typed. With it off, a minus sign is refused."
                controls="Sets CurrencyInputProps.hasSign"
            >
                <PageCheckField :value="hasSign" ariaLabel="Signed" @change="(value: boolean) => (hasSign = value)" />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
