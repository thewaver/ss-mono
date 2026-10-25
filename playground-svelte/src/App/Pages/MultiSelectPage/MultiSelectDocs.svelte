<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ClearableDocsExample from "./Docs/Clearable.svelte";
    import GroupedDocsExample from "./Docs/Grouped.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let hasError = $state(false);
    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets MultiSelectProps.hasError"}
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
            hint={"Turns the field off: it does not open, and the Tab key skips it."}
            controls={"Sets MultiSelectProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, the picks start from the right of the field, and the arrow and the clear button sit at its left end."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Groups and a query"}
    content={"Options can sit in groups, and a [prop]query[/prop] turns the field into a text box that narrows them, as on Select. What counts as a match is yours to decide; here a group the query has emptied is dropped from the list."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Grouped.svelte`}>
    <GroupedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Clearing every pick"}
    content={"Give it [prop]renderClear[/prop] and a clear button sits at the end of the field while anything is picked; pressing it empties every pick at once and reports the change like any other. It needs [prop]clearAriaLabel[/prop] to name it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Clearable.svelte`}>
    <ClearableDocsExample />
</PageDocsExample>
