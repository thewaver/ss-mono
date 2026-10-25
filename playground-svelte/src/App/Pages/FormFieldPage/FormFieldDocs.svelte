<script lang="ts">
    import type { FormFieldOrientation } from "@thewaver/ss-components-svelte";
    import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageTextField from "../../PageComponents/Field/PageTextField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ForeignDocsExample from "./Docs/Foreign.svelte";
    import InFormDocsExample from "./Docs/InForm.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let orientation = $state<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
    let gap = $state(FORM_FIELD_DEFAULTS.gap);
    let message = $state(FormFieldKnobs.STARTING_MESSAGE);
    let isRequired = $state(false);
    let hasError = $state(FormFieldKnobs.STARTING_HAS_ERROR);
    let inFormHasError = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {gap} {message} {isRequired} {hasError} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            label={"Orientation"}
            hint={"Whether the caption sits above the control or beside it."}
            controls={"Sets FormFieldProps.orientation"}
        >
            <PageSelectField
                value={orientation}
                values={FORM_FIELD_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"gap"}
            label={"Gap (px)"}
            hint={"The space between the caption, the control and the message."}
            controls={"Sets FormFieldProps.gap"}
        >
            <PageNumberField
                value={gap}
                min={FormFieldKnobs.MIN_GAP}
                max={FormFieldKnobs.MAX_GAP}
                step={FormFieldKnobs.GAP_STEP}
                ariaLabel={"Gap in pixels"}
                onInput={(value) => {
                    gap = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"message"}
            label={"Message"}
            hint={"The line shown under the control. Leave it empty and no line is rendered at all."}
            controls={"Sets FormFieldProps.message"}
        >
            <PageTextField
                value={message}
                placeholder={"No message"}
                ariaLabel={"Message"}
                onInput={(value) => {
                    message = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isRequired"}
            label={"Required"}
            hint={"Tells screen readers a value is expected, and hands the caption the state to mark it. Nothing is enforced."}
            controls={"Sets FormFieldProps.isRequired"}
        >
            <PageCheckField
                value={isRequired}
                ariaLabel={"Required"}
                onChange={(value) => {
                    isRequired = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Puts the field into its error look and reads the message out as the error rather than as help."}
            controls={"Sets FormFieldProps.hasError"}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the caption, the field and the message line up on the right, and what is typed starts from the right of the field. With [prop]orientation[/prop] set to horizontal, the caption sits to the right of the field instead."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Around a control of your own"}
    content={"The library's own controls find the field's caption and message by themselves. A control of your own, here a plain input, gets the same wiring from two calls: FormFieldSvelteUtils.resolveAriaLabelledBy answers with the caption's id to put in its aria-labelledby, which names it, and FormFieldSvelteUtils.resolveAriaDescribedBy with the message's id to put in its aria-describedby, or with nothing while there is no message."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Foreign.svelte`}>
    <ForeignDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Inside a form"}
    content={"A field inside a Form reports to it, so the form's [prop]isValid[/prop] is false while the field's [prop]hasError[/prop] is on, and the line under the button says so; nothing here hands the field's state to the form. Saving while the error is on moves focus to the field."}
/>

<PageDocsExample path={`${DOCS_ROOT}/InForm.svelte`}>
    <InFormDocsExample hasError={inFormHasError} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"inFormHasError"}
            label={"Error"}
            hint={"Puts the field in error, which the form hears without being told."}
            controls={"Sets FormFieldProps.hasError"}
        >
            <PageCheckField
                value={inFormHasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    inFormHasError = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
