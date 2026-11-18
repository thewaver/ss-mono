<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import SubmenusDocsExample from "./Docs/Submenus.svelte";
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.submenus}
/>

<PageDocsExample path={`${DOCS_ROOT}/Submenus.svelte`}>
    <SubmenusDocsExample />
</PageDocsExample>
