<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import PickerDocsExample from "./Docs/Picker.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import { ColorAreaKnobs } from "@thewaver/ss-playground/App/Knobs/ColorAreas.const";

    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDisabled"}
            {...ColorAreaKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.pickerBuiltAround}
/>

<PageDocsExample path={`${DOCS_ROOT}/Picker.svelte`}>
    <PickerDocsExample />
</PageDocsExample>
