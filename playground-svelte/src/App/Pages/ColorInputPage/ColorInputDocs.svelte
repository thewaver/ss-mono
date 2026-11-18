<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SnappingDocsExample from "./Docs/Snapping.svelte";
    import SwatchDocsExample from "./Docs/Swatch.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { ColorInputKnobs } from "@thewaver/ss-playground/App/Knobs/ColorInputs.const";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...ColorInputKnobs.HAS_ERROR_TEXT}
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
            {...ColorInputKnobs.IS_DISABLED_TEXT}
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
    title={"A swatch alone"}
    content={"The field draws nothing of its own: [prop]renderContent[/prop] is handed the color and paints it however it likes, here as a swatch with no text beside it. The readout shows the value the swatch stands for. The field's name says what the color is for, so the color itself reaches a screen reader as the field's description, from [prop]computeValueText[/prop]: here its red, green and blue spelled out. Left out, the value is read as written, and no painter has to draw any text for it ([wcag id=\"4.1.2\"]WCAG 4.1.2[/wcag])."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Swatch.svelte`}>
    <SwatchDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.correctingPick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Snapping.svelte`}>
    <SnappingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...ColorInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...ColorInputKnobs.IS_DISABLED_TEXT}
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
