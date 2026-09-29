<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-vue";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import { BUDGET_MAX } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { CurrencyInputExampleProps } from "./CurrencyInputPage.types";
import BoundedExample from "./Examples/Bounded.vue";
import DefaultExample from "./Examples/Default.vue";
import SymbolExample from "./Examples/Symbol.vue";

const LOCALE_FIELD_WIDTH = 120;
const LOCALE_GROUPING = "locale";
const EXAMPLES_ROOT = "/src/App/Pages/CurrencyInputPage/Examples";

const STARTING_PRICE = 1234.56;
const STARTING_BUDGET = 4999.99;
const STARTING_BIG = 9876543210.12;
const STARTING_ADJUSTMENT = -250.5;
const describe = (value: number | undefined) => (value === undefined ? "none" : `${value}`);

const describeGrouping = (sizes: number[] | undefined) =>
    sizes === undefined ? LOCALE_GROUPING : sizes.join(" then ");

const locale = shallowRef(CurrencyInputKnobs.STARTING_LOCALE);
const decimals = shallowRef(CURRENCY_INPUT_DEFAULTS.decimals);
const grouping = shallowRef<number[] | undefined>();
const hasSign = shallowRef(CurrencyInputKnobs.STARTING_HAS_SIGN);

const price = shallowRef<number | undefined>(STARTING_PRICE);
const empty = shallowRef<number | undefined>();
const budget = shallowRef<number | undefined>(STARTING_BUDGET);
const big = shallowRef<number | undefined>(STARTING_BIG);
const negative = shallowRef<number | undefined>(STARTING_ADJUSTMENT);

const commonProps = computed<Omit<CurrencyInputExampleProps, "value" | "onUpdate:value">>(() => ({
    locale: locale.value,
    decimals: decimals.value,
    groupSizes: grouping.value,
    hasSign: hasSign.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () =>
            `value: ${describe(price.value)} — digits fill from the right, and the separators are the field's rather than yours to type`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "empty",
        name: "Empty",
        readout: () => `value: ${describe(empty.value)} — an empty field has no value at all`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "symbol",
        name: "With a symbol",
        readout: () =>
            `value: ${describe(price.value)} — the currency is paint in a slot, since the library holds no currencies`,
        path: `${EXAMPLES_ROOT}/Symbol.vue`,
    },
    {
        key: "bounded",
        name: "Bounded",
        readout: () =>
            `value: ${describe(budget.value)} — at most ${BUDGET_MAX}, and going over is refused as it is typed`,
        path: `${EXAMPLES_ROOT}/Bounded.vue`,
    },
    {
        key: "negative",
        name: "Signed",
        readout: () =>
            `value: ${describe(negative.value)} — a minus is only accepted where the field was told to hold one`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "big",
        name: "Many groups",
        readout: () =>
            `value: ${describe(big.value)} — the group count grows with the value, which a fixed pattern cannot do`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="locale"
            label="Locale"
            hint="Which country's conventions the amount is written in, which decides the separators and where the symbol sits."
        >
            <PageSelectField
                :value="locale"
                :values="CurrencyInputKnobs.LOCALES"
                :width="LOCALE_FIELD_WIDTH"
                ariaLabel="Locale"
                @change="(value: string) => (locale = value)"
            />
        </PageProp>

        <PageProp item-key="decimals" label="Decimals" hint="How many digits are kept after the decimal separator.">
            <PageSelectField
                :value="decimals"
                :values="CurrencyInputKnobs.DECIMALS"
                ariaLabel="Decimals"
                @change="(value: number) => (decimals = value)"
            />
        </PageProp>

        <PageProp
            item-key="hasSign"
            label="Signed"
            hint="Allows negative amounts to be typed. With it off, a minus sign is rejected."
        >
            <PageCheckField :value="hasSign" ariaLabel="Signed" @change="(value: boolean) => (hasSign = value)" />
        </PageProp>

        <PageProp
            item-key="grouping"
            label="Grouping"
            hint="How the digits before the decimal point are grouped, such as in threes or in the Indian lakh pattern."
        >
            <PageSelectField
                :value="grouping"
                :values="CurrencyInputKnobs.GROUPINGS"
                :compute-label="describeGrouping"
                ariaLabel="Grouping"
                @change="(value: number[] | undefined) => (grouping = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-bind="commonProps" v-model:value="price" />
        </template>

        <template #empty>
            <DefaultExample v-bind="commonProps" v-model:value="empty" ariaLabel="Amount" />
        </template>

        <template #symbol>
            <SymbolExample v-bind="commonProps" v-model:value="price" />
        </template>

        <template #bounded>
            <BoundedExample v-bind="commonProps" v-model:value="budget" />
        </template>

        <template #negative>
            <DefaultExample v-bind="commonProps" v-model:value="negative" ariaLabel="Adjustment" has-sign />
        </template>

        <template #big>
            <DefaultExample v-bind="commonProps" v-model:value="big" ariaLabel="Large amount" />
        </template>
    </PageExamples>
</template>
