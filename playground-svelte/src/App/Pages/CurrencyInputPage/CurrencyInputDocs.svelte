<script lang="ts">
    import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
    import {
        BUDGET_MAX,
        DOCS_ROOT,
        LOCALE_FIELD_WIDTH,
        LOCALE_GROUPING,
    } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import LocaleDocsExample from "./Docs/Locale.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SignedDocsExample from "./Docs/Signed.svelte";
    import SymbolDocsExample from "./Docs/Symbol.svelte";

    const describeGrouping = (sizes: number[] | undefined) =>
        sizes === undefined ? LOCALE_GROUPING : sizes.join(" then ");

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let locale = $state(CurrencyInputKnobs.STARTING_LOCALE);
    let decimals = $state(CURRENCY_INPUT_DEFAULTS.decimals);
    let grouping = $state.raw<number[] | undefined>();
    let max = $state(BUDGET_MAX);
    let hasSign = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            label={"Read-only"}
            hint={"Its amount can be selected and copied, but neither typing nor pasting changes it."}
            controls={"Sets CurrencyInputProps.isReadOnly"}
        >
            <PageCheckField
                value={isReadOnly}
                ariaLabel={"Read-only"}
                onChange={(value) => {
                    isReadOnly = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets CurrencyInputProps.hasError"}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            label={"Disabled"}
            hint={"Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."}
            controls={"Sets CurrencyInputProps.isDisabled"}
        >
            <PageCheckField
                value={isDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the leading slot, here the symbol, sits on the right and the amount starts beside it, while the digits keep their own order."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Written the local way"}
    content={"Give it a [prop]locale[/prop] and the amount is written the way that place writes money: which separators, and in which groups. The [prop]decimals[/prop] say how many digits follow the separator, and [prop]groupSizes[/prop] overrides the locale's grouping, such as the Indian pattern of a group of three and then groups of two. However many groups the amount needs, it gets."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Locale.svelte`}>
    <LocaleDocsExample {locale} {decimals} groupSizes={grouping} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"locale"}
            label={"Locale"}
            hint={"Which country's conventions the amount is written in, which decides the separators."}
            controls={"Sets CurrencyInputProps.locale"}
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

        <PageProp
            itemKey={"decimals"}
            label={"Decimals"}
            hint={"How many digits are kept after the decimal separator."}
            controls={"Sets CurrencyInputProps.decimals"}
        >
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
            itemKey={"groupSizes"}
            label={"Grouping"}
            hint={"How the digits before the decimal separator are grouped: the locale's own way, or a pattern such as threes or the Indian lakh."}
            controls={"Sets CurrencyInputProps.groupSizes"}
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
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"With a symbol"}
    content={"The field keeps no list of currencies, so the symbol is yours to draw, in the leading or the trailing slot, on whichever side your locale puts it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Symbol.svelte`}>
    <SymbolDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"A limit"}
    content={"Give it a [prop]max[/prop] and any amount above it is refused as it is typed, so the field never holds more."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample {max} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"max"}
            label={"Max"}
            hint={"The largest amount the field accepts."}
            controls={"Sets CurrencyInputProps.max"}
        >
            <PageNumberField
                value={max}
                min={CurrencyInputKnobs.MIN_MAX}
                max={CurrencyInputKnobs.MAX_MAX}
                step={CurrencyInputKnobs.MAX_STEP}
                ariaLabel={"Max"}
                onInput={(value) => {
                    max = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Negative amounts"}
    content={"With [prop]hasSign[/prop] on, a minus can be typed and the amount can go below zero. Off, the default, a minus is refused."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Signed.svelte`}>
    <SignedDocsExample {hasSign} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasSign"}
            label={"Signed"}
            hint={"Allows negative amounts to be typed. With it off, a minus sign is refused."}
            controls={"Sets CurrencyInputProps.hasSign"}
        >
            <PageCheckField
                value={hasSign}
                ariaLabel={"Signed"}
                onChange={(value) => {
                    hasSign = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
