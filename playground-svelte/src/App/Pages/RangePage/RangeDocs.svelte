<script lang="ts">
    import type { RangeOrientation } from "@thewaver/ss-components-svelte";
    import { RANGE_DEFAULTS, RANGE_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { RangeKnobs } from "@thewaver/ss-playground/App/Knobs/Ranges.const";
    import { DOCS_SECTIONS,
        DIFFICULTY_MAX,
        DIFFICULTY_MIN,
        DIFFICULTY_STEP,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import KnobDocsExample from "./Docs/Knob.svelte";
    import PairDocsExample from "./Docs/Pair.svelte";
    import PricesDocsExample from "./Docs/Prices.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SteppingDocsExample from "./Docs/Stepping.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";

    let orientation = $state<RangeOrientation>(RANGE_DEFAULTS.orientation);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let min = $state(DIFFICULTY_MIN);
    let max = $state(DIFFICULTY_MAX);
    let step = $state(DIFFICULTY_STEP);
    let isPairDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...RangeKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={RANGE_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            {...RangeKnobs.HAS_ERROR_TEXT}
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
            {...RangeKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.steppingLimits}
/>

<PageDocsExample path={`${DOCS_ROOT}/Stepping.svelte`}>
    <SteppingDocsExample {min} {max} {step} />

    {#snippet renderKnobs()}
        <PageProp itemKey={"min"} {...RangeKnobs.MIN_TEXT}>
            <PageNumberField
                value={min}
                min={RangeKnobs.MIN_LIMIT}
                max={RangeKnobs.MAX_LIMIT}
                step={RangeKnobs.LIMIT_STEP}
                ariaLabel={"Min"}
                onInput={(value) => {
                    min = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"max"} {...RangeKnobs.MAX_TEXT}>
            <PageNumberField
                value={max}
                min={RangeKnobs.MIN_LIMIT}
                max={RangeKnobs.MAX_LIMIT}
                step={RangeKnobs.LIMIT_STEP}
                ariaLabel={"Max"}
                onInput={(value) => {
                    max = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"step"}
            {...RangeKnobs.STEP_TEXT}
        >
            <PageNumberField
                value={step}
                min={RangeKnobs.MIN_STEP}
                max={RangeKnobs.MAX_STEP}
                step={RangeKnobs.STEP_STEP}
                ariaLabel={"Step"}
                onInput={(value) => {
                    step = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.twoThumbs}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pair.svelte`}>
    <PairDocsExample isDisabled={isPairDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"pairIsDisabled"}
            {...RangeKnobs.PAIR_IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isPairDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isPairDisabled = value;
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
    {...DOCS_SECTIONS.readPrices}
/>

<PageDocsExample path={`${DOCS_ROOT}/Prices.svelte`}>
    <PricesDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Drawn as a knob"}
    content={"Pass [prop]computeValueAtPoint[/prop] and the range follows the pointer itself, asking that function which value a point on the control stands for. RangeUtils.computeAngularValue answers by the point's angle round the center, which turns the slider into a knob. A press sets the value at once, so turning it never needs a drag ([wcag id=\"2.5.7\"]WCAG 2.5.7[/wcag]), and the arrow keys still step it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Knob.svelte`}>
    <KnobDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...RangeKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...RangeKnobs.IS_DISABLED_TEXT}
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
