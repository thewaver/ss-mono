<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import SubmittedDocsExample from "./Docs/Submitted.svelte";
    import ValuesDocsExample from "./Docs/Values.svelte";
</script>

<PageDocsAlert severity="info">
    Form validates nothing. Every message and every error here comes from the example's own code; Form only passes on
    what its fields report.
</PageDocsAlert>

<PageDocsSection
    {...DOCS_SECTIONS.errorsWhileTyping}
/>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.errorsShownOnceForm}
/>

<PageDocsExample path={`${DOCS_ROOT}/Submitted.svelte`}>
    <SubmittedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.readingWhatWasSent}
/>

<PageDocsExample path={`${DOCS_ROOT}/Values.svelte`}>
    <ValuesDocsExample />
</PageDocsExample>
