<script lang="ts">
    import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
    import { DOCS_SECTIONS,
        DOCS_ROOT,
        GERMAN_LOCALE,
        NUMBER_LOCALES,
        QUANTITY_MAX,
        QUANTITY_MIN,
        QUANTITY_STEP,
    } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import LocaleDocsExample from "./Docs/Locale.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SteppingDocsExample from "./Docs/Stepping.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import UnitDocsExample from "./Docs/Unit.svelte";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let min = $state(QUANTITY_MIN);
    let max = $state(QUANTITY_MAX);
    let step = $state(QUANTITY_STEP);
    let locale = $state(GERMAN_LOCALE);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            {...NumberInputKnobs.IS_READ_ONLY_TEXT}
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
            {...NumberInputKnobs.HAS_ERROR_TEXT}
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
            {...NumberInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.steppingLimits}
/>

<PageDocsExample path={`${DOCS_ROOT}/Stepping.svelte`}>
    <SteppingDocsExample {min} {max} {step} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"min"}
            {...NumberInputKnobs.MIN_TEXT}
        >
            <PageNumberField
                value={min}
                min={NumberInputKnobs.MIN_LIMIT}
                max={NumberInputKnobs.MAX_LIMIT}
                step={NumberInputKnobs.LIMIT_STEP}
                ariaLabel={"Min"}
                onInput={(value) => {
                    min = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"max"}
            {...NumberInputKnobs.MAX_TEXT}
        >
            <PageNumberField
                value={max}
                min={NumberInputKnobs.MIN_LIMIT}
                max={NumberInputKnobs.MAX_LIMIT}
                step={NumberInputKnobs.LIMIT_STEP}
                ariaLabel={"Max"}
                onInput={(value) => {
                    max = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"step"}
            {...NumberInputKnobs.STEP_TEXT}
        >
            <PageNumberField
                value={step}
                min={NumberInputKnobs.MIN_STEP}
                max={NumberInputKnobs.MAX_STEP}
                step={NumberInputKnobs.STEP_STEP}
                ariaLabel={"Step"}
                onInput={(value) => {
                    step = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.numbersWrittenLocalWay}
/>

<PageDocsExample path={`${DOCS_ROOT}/Locale.svelte`}>
    <LocaleDocsExample {locale} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"locale"}
            {...NumberInputKnobs.LOCALE_TEXT}
        >
            <PageSelectField
                value={locale}
                values={NUMBER_LOCALES}
                ariaLabel={"Locale"}
                onChange={(value) => {
                    locale = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.unitBesideStepper}
/>

<PageDocsExample path={`${DOCS_ROOT}/Unit.svelte`}>
    <UnitDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...NumberInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
        >
            <PageCheckField
                value={isReachableWhenDisabled}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachableWhenDisabled = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"tooltipIsDisabled"}
            {...NumberInputKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isTooltipDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isTooltipDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.namedLabel}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
