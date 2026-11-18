<script lang="ts">
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DropZoneDocsExample from "./Docs/DropZone.svelte";
    import ImagesDocsExample from "./Docs/Images.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import MultipleDocsExample from "./Docs/Multiple.svelte";
    import RefusingDocsExample from "./Docs/Refusing.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { FileInputKnobs } from "@thewaver/ss-playground/App/Knobs/FileInputs.const";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let dropZoneHasError = $state(false);
    let dropZoneIsDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...FileInputKnobs.HAS_ERROR_TEXT}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...FileInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.severalFiles}
/>

<PageDocsExample path={`${DOCS_ROOT}/Multiple.svelte`}>
    <MultipleDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.someFileKindsOnly}
/>

<PageDocsExample path={`${DOCS_ROOT}/Images.svelte`}>
    <ImagesDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.refusingPick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Refusing.svelte`}>
    <RefusingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.droppingFilesWithinLimits}
/>

<PageDocsAlert severity="alert">
    Keep the control pressable, and say so in what it shows. A drop is a drag, which not everyone can make, so
    pressing the control to open the dialog must reach the same files (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>).
    Never cover the control with a drop area, or paint it as a place to drop alone.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/DropZone.svelte`}>
    <DropZoneDocsExample hasError={dropZoneHasError} isDisabled={dropZoneIsDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"dropZoneHasError"}
            {...FileInputKnobs.HAS_ERROR_TEXT}
        >
            <PageCheckField
                value={dropZoneHasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    dropZoneHasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"dropZoneIsDisabled"}
            {...FileInputKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={dropZoneIsDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    dropZoneIsDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...FileInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
        >
            <PageCheckField
                value={isReachableWhenDisabled}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachableWhenDisabled = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"tooltipIsDisabled"}
            {...FileInputKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isTooltipDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isTooltipDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.namedLabel}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
