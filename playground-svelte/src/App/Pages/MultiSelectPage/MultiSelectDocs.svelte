<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ClearableDocsExample from "./Docs/Clearable.svelte";
    import GroupedDocsExample from "./Docs/Grouped.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import { MultiSelectKnobs } from "@thewaver/ss-playground/App/Knobs/MultiSelects.const";

    let hasError = $state(false);
    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...MultiSelectKnobs.HAS_ERROR_TEXT}
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
            {...MultiSelectKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.groupsQuery}
/>

<PageDocsExample path={`${DOCS_ROOT}/Grouped.svelte`}>
    <GroupedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.clearingEveryPick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Clearable.svelte`}>
    <ClearableDocsExample />
</PageDocsExample>
