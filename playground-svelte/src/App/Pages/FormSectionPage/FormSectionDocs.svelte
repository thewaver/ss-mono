<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import NestedDocsExample from "./Docs/Nested.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SectionsDocsExample from "./Docs/Sections.svelte";
</script>

<PageDocsSection
    {...DOCS_SECTIONS.groupRule}
/>

<PageDocsExample path={`${DOCS_ROOT}/Sections.svelte`}>
    <SectionsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.sectionInsideSection}
/>

<PageDocsExample path={`${DOCS_ROOT}/Nested.svelte`}>
    <NestedDocsExample />
</PageDocsExample>
