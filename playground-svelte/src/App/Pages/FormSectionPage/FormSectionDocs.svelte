<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import NestedDocsExample from "./Docs/Nested.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SectionsDocsExample from "./Docs/Sections.svelte";
</script>

<PageDocsSection
    title={"A rule that belongs to the group"}
    content={"Each field reports to the section it sits in, and the section reports one answer to the form: valid while none of its fields is in error and its own [prop]hasError[/prop] is off. That own error is for a rule no single field can carry, such as two passwords that must match: both fields are fine on their own, and the section still says no, through its [prop]message[/prop], which is read out when it appears and describes the group afterwards. The form's [prop]isValid[/prop] drives the line under the buttons, and sending moves focus to the first field in error, or, when only the section's own rule fails, to the first field in that section."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Sections.svelte`}>
    <SectionsDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the legend and the fields line up on the right, and what is typed starts from the right of each field."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"A section inside a section"}
    content={"Sections nest: here the payment section reports to the delivery section, which reports to the form, so a wrong card number travels up two levels before the form hears it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Nested.svelte`}>
    <NestedDocsExample />
</PageDocsExample>
