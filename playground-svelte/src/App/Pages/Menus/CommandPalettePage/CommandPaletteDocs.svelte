<script lang="ts">
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

    import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import ActionShortcutsDocsExample from "./Docs/ActionShortcuts.svelte";
    import BareLetterDocsExample from "./Docs/BareLetter.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.actionsWithOwnShortcuts}
/>

<PageDocsExample path={`${DOCS_ROOT}/ActionShortcuts.svelte`}>
    <ActionShortcutsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.bareLetterShortcut}
/>

<PageDocsAlert severity="alert">
    A shortcut of a single character needs a way for the person to turn it off or change it, such as a setting in your
    app, or it fails <a href={WCAG_URLS["2.1.4"]}>WCAG 2.1.4</a>. The library warns about every such shortcut it
    registers, since it cannot tell whether you have.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/BareLetter.svelte`}>
    <BareLetterDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
