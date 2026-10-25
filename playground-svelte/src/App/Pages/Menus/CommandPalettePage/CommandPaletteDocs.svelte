<script lang="ts">
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

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
    title={"Actions with shortcuts of their own"}
    content={"Give an action a [prop]shortcut[/prop] and pressing it runs the action from anywhere on the page, with the palette closed. Here Alt+Shift+N adds a note, Alt+Shift+R removes the last one and Alt+Shift+X clears them, with Option in place of Alt on a Mac. The palette writes each shortcut beside its action, handed to the option painter already resolved for the platform, so the list also teaches them. Every shortcut stays quiet while a dialog is open over the page, this palette included. The palette's own [prop]shortcut[/prop] opens it in the same way; no example here is given one, since Ctrl+K, or ⌘K on a Mac, already opens the Playground's own palette on every page, and the same shortcut registered twice warns in the console and runs only the later."}
/>

<PageDocsExample path={`${DOCS_ROOT}/ActionShortcuts.svelte`}>
    <ActionShortcutsDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"A bare-letter shortcut"}
    content={'A shortcut of a single character, with no modifier but Shift, is easy to set off by accident, so [wcag id="2.1.4"]WCAG 2.1.4[/wcag] asks that a person can turn it off or change it. It never runs while focus is in a text field, where the key is a letter like any other, and registering one warns in the console during development; this example warns on purpose. Here G says hello anywhere on the page but in the field. The Turn G off button below is the way to turn it off that the criterion asks for: it takes the shortcut off the action, and in your app it would be a setting.'}
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
    title={"Right to left"}
    content={"Opened from a box whose text runs right to left, the palette takes that direction although it is drawn over the whole page: the search field types from the right, and the group headings and the actions' names start at the right."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
