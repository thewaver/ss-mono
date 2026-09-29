<script lang="ts">
    import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
    import { BUDGET_MAX } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CurrencyInputExampleProps } from "./CurrencyInputPage.types";
    import BoundedExample from "./Examples/Bounded.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import SymbolExample from "./Examples/Symbol.svelte";

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

    let locale = $state(CurrencyInputKnobs.STARTING_LOCALE);
    let decimals = $state(CURRENCY_INPUT_DEFAULTS.decimals);
    let grouping = $state.raw<number[] | undefined>();
    let hasSign = $state(CurrencyInputKnobs.STARTING_HAS_SIGN);

    let price = $state<number | undefined>(STARTING_PRICE);
    let empty = $state<number | undefined>();
    let budget = $state<number | undefined>(STARTING_BUDGET);
    let big = $state<number | undefined>(STARTING_BIG);
    let negative = $state<number | undefined>(STARTING_ADJUSTMENT);

    const commonProps: Omit<CurrencyInputExampleProps, "value"> = $derived({
        locale,
        decimals,
        groupSizes: grouping,
        hasSign,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `value: ${describe(price)} — digits fill from the right, and the separators are the field's rather than yours to type`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "empty",
            name: "Empty",
            readout: () => `value: ${describe(empty)} — an empty field has no value at all`,
            component: emptyExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "symbol",
            name: "With a symbol",
            readout: () =>
                `value: ${describe(price)} — the currency is paint in a slot, since the library holds no currencies`,
            component: symbolExample,
            path: `${EXAMPLES_ROOT}/Symbol.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `value: ${describe(budget)} — at most ${BUDGET_MAX}, and going over is refused as it is typed`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Bounded.svelte`,
        },
        {
            key: "negative",
            name: "Signed",
            readout: () =>
                `value: ${describe(negative)} — a minus is only accepted where the field was told to hold one`,
            component: negativeExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "big",
            name: "Many groups",
            readout: () =>
                `value: ${describe(big)} — the group count grows with the value, which a fixed pattern cannot do`,
            component: bigExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} bind:value={price} />
{/snippet}

{#snippet emptyExample()}
    <DefaultExample {...commonProps} bind:value={empty} ariaLabel={"Amount"} />
{/snippet}

{#snippet symbolExample()}
    <SymbolExample {...commonProps} bind:value={price} />
{/snippet}

{#snippet boundedExample()}
    <BoundedExample {...commonProps} bind:value={budget} />
{/snippet}

{#snippet negativeExample()}
    <DefaultExample {...commonProps} bind:value={negative} ariaLabel={"Adjustment"} hasSign={true} />
{/snippet}

{#snippet bigExample()}
    <DefaultExample {...commonProps} bind:value={big} ariaLabel={"Large amount"} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"locale"}
        label={"Locale"}
        hint={
            "Which country's conventions the amount is written in, which decides the separators and where the symbol sits."
        }
    >
        <PageSelectField
            value={locale}
            values={CurrencyInputKnobs.LOCALES}
            width={LOCALE_FIELD_WIDTH}
            ariaLabel={"Locale"}
            onChange={(value) => {
                locale = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"decimals"} label={"Decimals"} hint={"How many digits are kept after the decimal separator."}>
        <PageSelectField
            value={decimals}
            values={CurrencyInputKnobs.DECIMALS}
            ariaLabel={"Decimals"}
            onChange={(value) => {
                decimals = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hasSign"}
        label={"Signed"}
        hint={"Allows negative amounts to be typed. With it off, a minus sign is rejected."}
    >
        <PageCheckField
            value={hasSign}
            ariaLabel={"Signed"}
            onChange={(value) => {
                hasSign = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"grouping"}
        label={"Grouping"}
        hint={
            "How the digits before the decimal point are grouped, such as in threes or in the Indian lakh pattern."
        }
    >
        <PageSelectField
            value={grouping}
            values={CurrencyInputKnobs.GROUPINGS}
            computeLabel={describeGrouping}
            ariaLabel={"Grouping"}
            onChange={(value) => {
                grouping = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
