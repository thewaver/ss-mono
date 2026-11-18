<script lang="ts">
    import type { LabelOrientation } from "@thewaver/ss-components-svelte";
    import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

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
    import { LabelKnobs } from "@thewaver/ss-playground/App/Knobs/Labels.const";

    let orientation = $state<LabelOrientation>(LABEL_DEFAULTS.orientation);
    let isDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...LabelKnobs.ORIENTATION_TEXT}
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
            {...LabelKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.captionFirst}
/>

<PageDocsExample path={`${DOCS_ROOT}/CaptionFirst.svelte`}>
    <CaptionFirstDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.oneLabelPerRadio}
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
