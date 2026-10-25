<script lang="ts">
    import type { LabelOrientation } from "@thewaver/ss-components-svelte";
    import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CaptionFirstDocsExample from "./Docs/CaptionFirst.svelte";
    import LabelPerRadioDocsExample from "./Docs/LabelPerRadio.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SuppressedDocsExample from "./Docs/Suppressed.svelte";

    let orientation = $state<LabelOrientation>(LABEL_DEFAULTS.orientation);
    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            label={"Orientation"}
            hint={"Whether the caption and the checkbox sit side by side or one above the other, in the order they are written."}
            controls={"Sets LabelProps.orientation"}
        >
            <PageSelectField
                value={orientation}
                values={LABEL_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            label={"Disabled"}
            hint={"Turns the checkbox off: pressing it or its caption changes nothing, and the Tab key skips it."}
            controls={"Sets CheckboxProps.isDisabled on the checkbox inside the label"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the label lays its children out from the right, so the checkbox, written first, sits to the right of its caption."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"The caption first"}
    content={"The caption and the control sit in the order they are written, so a caption written first comes before the control, as is usual beside a switch. Pressing the caption still flips it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/CaptionFirst.svelte`}>
    <CaptionFirstDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"One label per radio"}
    content={"A label names one control, so in a radio group each radio gets a label of its own. The group as a whole is named through its own [prop]ariaLabel[/prop], since a caption wrapped round the whole group would name only the first radio, and pressing it would pick that one."}
/>

<PageDocsExample path={`${DOCS_ROOT}/LabelPerRadio.svelte`}>
    <LabelPerRadioDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"The caption wins"}
    content={"Inside a label, the caption is the control's name. A control also given an [prop]ariaLabel[/prop] drops it and warns in the console during development, since a screen reader would otherwise announce words that are not on screen, which fails [wcag id=\"2.5.3\"]WCAG 2.5.3[/wcag]. This checkbox was given \"Announced as something else\", and is still announced as its caption."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Suppressed.svelte`}>
    <SuppressedDocsExample />
</PageDocsExample>
