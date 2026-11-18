<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import LimitsDocsExample from "./Docs/Limits.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SecondsDocsExample from "./Docs/Seconds.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import TwelveHourDocsExample from "./Docs/TwelveHour.svelte";
    import { TimeInputKnobs } from "@thewaver/ss-playground/App/Knobs/TimeInputs.const";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let isTwelveHour = $state(true);
    let hasSeconds = $state(true);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            {...TimeInputKnobs.IS_READ_ONLY_TEXT}
        >
            <PageCheckField
                value={isReadOnly}
                ariaLabel={"Read-only"}
                onChange={(value) => {
                    isReadOnly = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            {...TimeInputKnobs.HAS_ERROR_TEXT}
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
            {...TimeInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.twelveHours}
/>

<PageDocsExample path={`${DOCS_ROOT}/TwelveHour.svelte`}>
    <TwelveHourDocsExample {isTwelveHour} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isTwelveHour"}
            {...TimeInputKnobs.IS_TWELVE_HOUR_TEXT}
        >
            <PageCheckField
                value={isTwelveHour}
                ariaLabel={"Twelve hour"}
                onChange={(value) => {
                    isTwelveHour = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.second}
/>

<PageDocsExample path={`${DOCS_ROOT}/Seconds.svelte`}>
    <SecondsDocsExample {hasSeconds} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasSeconds"}
            {...TimeInputKnobs.HAS_SECONDS_TEXT}
        >
            <PageCheckField
                value={hasSeconds}
                ariaLabel={"Seconds"}
                onChange={(value) => {
                    hasSeconds = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.withinOpeningHours}
/>

<PageDocsExample path={`${DOCS_ROOT}/Limits.svelte`}>
    <LimitsDocsExample />
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
            {...TimeInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...TimeInputKnobs.IS_DISABLED_TEXT}
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
