<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SelectAllDocsExample from "./Docs/SelectAll.svelte";
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.selectAllBox}
/>

<PageDocsExample path={`${DOCS_ROOT}/SelectAll.svelte`}>
    <SelectAllDocsExample />
</PageDocsExample>
