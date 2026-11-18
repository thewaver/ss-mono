<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AdornmentsDocsExample from "./Docs/Adornments.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import EditableDocsExample from "./Docs/Editable.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import NumberDocsExample from "./Docs/Number.svelte";
    import PasswordDocsExample from "./Docs/Password.svelte";
    import RefusingDocsExample from "./Docs/Refusing.svelte";
    import RewritingDocsExample from "./Docs/Rewriting.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SuggestionsDocsExample from "./Docs/Suggestions.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { TextInputKnobs } from "@thewaver/ss-playground/App/Knobs/TextInputs.const";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            {...TextInputKnobs.IS_READ_ONLY_TEXT}
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
            {...TextInputKnobs.HAS_ERROR_TEXT}
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
            {...TextInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.rewritingWhatTyped}
/>

<PageDocsExample path={`${DOCS_ROOT}/Rewriting.svelte`}>
    <RewritingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.refusingWhatTyped}
/>

<PageDocsExample path={`${DOCS_ROOT}/Refusing.svelte`}>
    <RefusingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.leadingTrailingContent}
/>

<PageDocsExample path={`${DOCS_ROOT}/Adornments.svelte`}>
    <AdornmentsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.passwords}
/>

<PageDocsExample path={`${DOCS_ROOT}/Password.svelte`}>
    <PasswordDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.numbers}
/>

<PageDocsExample path={`${DOCS_ROOT}/Number.svelte`}>
    <NumberDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.suggestions}
/>

<PageDocsExample path={`${DOCS_ROOT}/Suggestions.svelte`}>
    <SuggestionsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...TextInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...TextInputKnobs.IS_DISABLED_TEXT}
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

<PageDocsSection
    {...DOCS_SECTIONS.editingPlace}
/>

<PageDocsExample path={`${DOCS_ROOT}/Editable.svelte`}>
    <EditableDocsExample />
</PageDocsExample>
