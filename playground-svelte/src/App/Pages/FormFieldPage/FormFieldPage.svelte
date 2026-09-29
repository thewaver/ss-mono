<script lang="ts">
    import type { FormFieldOrientation } from "@thewaver/ss-components-svelte";
    import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageTextField from "../../PageComponents/Field/PageTextField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import ForeignExample from "./Examples/Foreign.svelte";
    import InFormExample from "./Examples/InForm.svelte";
    import type { FormFieldExampleProps } from "./FormFieldPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/FormFieldPage/Examples";

    const FIELD_WIDTH = 110;
    const MESSAGE_WIDTH = 240;

    let orientation = $state<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
    let gap = $state(FORM_FIELD_DEFAULTS.gap);
    let message = $state(FormFieldKnobs.STARTING_MESSAGE);
    let hasError = $state(FormFieldKnobs.STARTING_HAS_ERROR);

    let defaultValue = $state("");
    let foreignValue = $state("");
    let formValue = $state("");

    const commonProps: Omit<FormFieldExampleProps, "value"> = $derived({
        orientation,
        gap,
        message,
        hasError,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Around a control of the library's",
            readout: () =>
                message.length > 0
                    ? "the message has an id of its own and the control inside is pointed at it, without either of them being told the other's name"
                    : "with no message there is no element and no reference — an empty message is not an empty box",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "foreign",
            name: "Around a control it has never seen",
            readout: () =>
                "a plain input, which knows nothing about any of this — one call to FormFieldSvelteUtils.resolveAriaDescribedBy gets it the same wiring the library's own controls get for free",
            component: foreignExample,
            path: `${EXAMPLES_ROOT}/Foreign.svelte`,
        },
        {
            key: "inForm",
            name: "Inside a form",
            readout: () =>
                "turn the error on — the field tells the form, and the form's own validity is what disables the button; nothing here reads the other's state directly",
            component: inFormExample,
            path: `${EXAMPLES_ROOT}/InForm.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} bind:value={defaultValue} />
{/snippet}

{#snippet foreignExample()}
    <ForeignExample {...commonProps} bind:value={foreignValue} />
{/snippet}

{#snippet inFormExample()}
    <InFormExample {...commonProps} bind:value={formValue} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"orientation"}
        label={"Orientation"}
        hint={"Whether the label sits above the control or beside it."}
    >
        <PageSelectField
            value={orientation}
            values={FORM_FIELD_ORIENTATIONS}
            width={FIELD_WIDTH}
            ariaLabel={"Orientation"}
            onChange={(value) => {
                orientation = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between the label, the control and the message."}>
        <PageNumberField
            value={gap}
            min={FormFieldKnobs.MIN_GAP}
            max={FormFieldKnobs.MAX_GAP}
            step={FormFieldKnobs.GAP_STEP}
            width={FIELD_WIDTH}
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
    >
        <PageTextField
            value={message}
            width={MESSAGE_WIDTH}
            placeholder={"No message"}
            ariaLabel={"Message"}
            onInput={(value) => {
                message = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hasError"}
        label={"In error"}
        hint={"Puts the field into its error look and reads the message out as the error rather than as help."}
    >
        <PageCheckField
            value={hasError}
            ariaLabel={"In error"}
            onChange={(value) => {
                hasError = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
