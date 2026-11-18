<script lang="ts">
    import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import PressedDocsExample from "./Docs/Pressed.svelte";
    import RefusingDocsExample from "./Docs/Refusing.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import RingDocsExample from "./Docs/Ring.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";

    let barWidth = $state(ToolbarKnobs.STARTING_BAR_WIDTH);
    let gap = $state(TOOLBAR_DEFAULTS.gap);
    let isTooltipDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample
        {barWidth}
        {gap}
        onBarWidthChange={(value) => {
            barWidth = value;
        }}
    />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"barWidth"}
            {...ToolbarKnobs.BAR_WIDTH_TEXT}
        >
            <PageNumberField
                value={barWidth}
                min={ToolbarKnobs.MIN_BAR_WIDTH}
                max={ToolbarKnobs.MAX_BAR_WIDTH}
                step={ToolbarKnobs.BAR_WIDTH_STEP}
                ariaLabel={"Bar width in pixels"}
                onInput={(value) => {
                    barWidth = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"gap"}
            {...ToolbarKnobs.GAP_TEXT}
        >
            <PageNumberField
                value={gap}
                min={ToolbarKnobs.MIN_GAP}
                max={ToolbarKnobs.MAX_GAP}
                step={ToolbarKnobs.GAP_STEP}
                ariaLabel={"Gap in pixels"}
                onInput={(value) => {
                    gap = value;
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
    {...DOCS_SECTIONS.actionsThatRefuseCollapse}
/>

<PageDocsExample path={`${DOCS_ROOT}/Refusing.svelte`}>
    <RefusingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.actionsThatStayPressed}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pressed.svelte`}>
    <PressedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltips}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...ToolbarKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...ToolbarKnobs.TOOLTIP_IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.ringTools}
/>

<PageDocsExample path={`${DOCS_ROOT}/Ring.svelte`}>
    <RingDocsExample />
</PageDocsExample>
