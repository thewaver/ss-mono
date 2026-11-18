<script lang="ts">
    import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
    import { DOCS_SECTIONS,
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
            {...CurrencyInputKnobs.IS_READ_ONLY_TEXT}
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
            {...CurrencyInputKnobs.HAS_ERROR_TEXT}
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
            {...CurrencyInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.writtenLocalWay}
/>

<PageDocsExample path={`${DOCS_ROOT}/Locale.svelte`}>
    <LocaleDocsExample {locale} {decimals} groupSizes={grouping} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"locale"}
            {...CurrencyInputKnobs.LOCALE_TEXT}
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
            {...CurrencyInputKnobs.DECIMALS_TEXT}
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
            {...CurrencyInputKnobs.GROUP_SIZES_TEXT}
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
    {...DOCS_SECTIONS.symbol}
/>

<PageDocsExample path={`${DOCS_ROOT}/Symbol.svelte`}>
    <SymbolDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.limit}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample {max} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"max"}
            {...CurrencyInputKnobs.MAX_TEXT}
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
    {...DOCS_SECTIONS.negativeAmounts}
/>

<PageDocsExample path={`${DOCS_ROOT}/Signed.svelte`}>
    <SignedDocsExample {hasSign} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasSign"}
            {...CurrencyInputKnobs.HAS_SIGN_TEXT}
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
