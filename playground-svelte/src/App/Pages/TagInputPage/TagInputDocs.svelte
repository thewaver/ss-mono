<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CrowdedDocsExample from "./Docs/Crowded.svelte";
    import EmptyDocsExample from "./Docs/Empty.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import UniqueDocsExample from "./Docs/Unique.svelte";
    import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsSection
    title={"Naming each tag"}
    content={"A tag is a button, and pressing it removes it. Its visible word alone does not say that, so a screen reader would hear only \"solid, button\" and not what the button is for ([wcag id=\"2.4.6\"]WCAG 2.4.6[/wcag]). Every example here names its tags through [prop]computeTagAriaLabel[/prop], which is handed the tag and answers in the page's language: here \"solid, remove\". The tag's own word comes first, so someone speaking to their computer can still say what they see ([wcag id=\"2.5.3\"]WCAG 2.5.3[/wcag])."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...TagInputKnobs.HAS_ERROR_TEXT}
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
            {...TagInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.placeholder}
/>

<PageDocsExample path={`${DOCS_ROOT}/Empty.svelte`}>
    <EmptyDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.refusingWord}
/>

<PageDocsExample path={`${DOCS_ROOT}/Unique.svelte`}>
    <UniqueDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.manyTagsNarrowBox}
/>

<PageDocsExample path={`${DOCS_ROOT}/Crowded.svelte`}>
    <CrowdedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...TagInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...TagInputKnobs.IS_DISABLED_TEXT}
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
