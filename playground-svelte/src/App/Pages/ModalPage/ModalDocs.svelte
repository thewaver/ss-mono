<script lang="ts">
    import { MODAL_ALIGNMENTS, MODAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { ModalAlignment } from "@thewaver/ss-components-svelte";
    import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AlertDocsExample from "./Docs/Alert.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DraggingDocsExample from "./Docs/Dragging.svelte";
    import LayeredDocsExample from "./Docs/Layered.svelte";
    import TextOnlyDocsExample from "./Docs/TextOnly.svelte";

    let alignment = $state<ModalAlignment>(MODAL_DEFAULTS.alignment);
    let transitionDurationMs = $state(MODAL_DEFAULTS.transitionDurationMs);
    let isDismissableOnOverlayClick = $state(false);
    let isDismissableOnEscape = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {alignment} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"alignment"}
            {...ModalKnobs.ALIGNMENT_TEXT}
        >
            <PageSelectField
                value={alignment}
                values={MODAL_ALIGNMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Alignment"}
                onChange={(value) => {
                    alignment = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...ModalKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={ModalKnobs.MIN_TRANSITION_MS}
                max={ModalKnobs.MAX_TRANSITION_MS}
                step={ModalKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.dialogThatMustBeAnswered}
/>

<PageDocsAlert severity="alert">
    With both <span class={docsStyles.docsPropName}>isDismissableOnOverlayClick</span> and
    <span class={docsStyles.docsPropName}>isDismissableOnEscape</span> off, the dialog has no way out of its own. Put a
    control inside it that closes it, as Delete and Cancel do here, or a keyboard user is shut in (<a
        href={WCAG_URLS["2.1.2"]}>WCAG 2.1.2</a
    >). The library cannot tell whether you have.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Alert.svelte`}>
    <AlertDocsExample {isDismissableOnOverlayClick} {isDismissableOnEscape} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDismissableOnOverlayClick"}
            {...ModalKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT}
        >
            <PageCheckField
                value={isDismissableOnOverlayClick}
                ariaLabel={"Closes on overlay click"}
                onChange={(value) => {
                    isDismissableOnOverlayClick = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDismissableOnEscape"}
            {...ModalKnobs.IS_DISMISSABLE_ON_ESCAPE_TEXT}
        >
            <PageCheckField
                value={isDismissableOnEscape}
                ariaLabel={"Closes on Escape"}
                onChange={(value) => {
                    isDismissableOnEscape = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.popupInside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Layered.svelte`}>
    <LayeredDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.dragInside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Dragging.svelte`}>
    <DraggingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.nothingFocusableInside}
/>

<PageDocsExample path={`${DOCS_ROOT}/TextOnly.svelte`}>
    <TextOnlyDocsExample />
</PageDocsExample>
