<script lang="ts">
    import { untrack } from "svelte";

    import { FrameRateMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { DOCS_SECTIONS, DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AutocompleteDocsExample from "./Docs/Autocomplete.svelte";
    import AutocompleteOnDemandDocsExample from "./Docs/AutocompleteOnDemand.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ClearableDocsExample from "./Docs/Clearable.svelte";
    import DescribedDocsExample from "./Docs/Described.svelte";
    import DisabledOptionsDocsExample from "./Docs/DisabledOptions.svelte";
    import GroupsDocsExample from "./Docs/Groups.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import OnDemandDocsExample from "./Docs/OnDemand.svelte";
    import RecordsDocsExample from "./Docs/Records.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import VirtualizedDocsExample from "./Docs/Virtualized.svelte";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let hasGroupBoxes = $state(true);
    let isReachable = $state(false);
    let count = $state(SelectKnobs.STARTING_STRESS_COUNT);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);

    let virtualizedVisibility = $state(false);
    let openMs = $state<number>();

    const { getFrameRate } = FrameRateMonitorSvelteUtils.create(() => !virtualizedVisibility);

    $effect(() => {
        const isOpen = virtualizedVisibility;

        if (!isOpen) return;

        untrack(() => {
            const startedAt = performance.now();

            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    openMs = performance.now() - startedAt;
                }),
            );
        });
    });

    const measurement = $derived.by(() => {
        const opened = openMs === undefined ? "Not opened yet" : `Opened in ${Math.round(openMs)} ms`;

        return virtualizedVisibility ? `${opened}, ${getFrameRate().current.toFixed(0)} fps while open` : opened;
    });
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...SelectKnobs.HAS_ERROR_TEXT}
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
            {...SelectKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.clearingPick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Clearable.svelte`}>
    <ClearableDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.recordsValues}
/>

<PageDocsExample path={`${DOCS_ROOT}/Records.svelte`}>
    <RecordsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.moreThanName}
/>

<PageDocsExample path={`${DOCS_ROOT}/Described.svelte`}>
    <DescribedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.groups}
/>

<PageDocsExample path={`${DOCS_ROOT}/Groups.svelte`}>
    <GroupsDocsExample {hasGroupBoxes} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasGroupBoxes"}
            {...SelectKnobs.HAS_GROUP_BOXES_TEXT}
        >
            <PageCheckField
                value={hasGroupBoxes}
                ariaLabel={"Group boxes"}
                onChange={(value) => {
                    hasGroupBoxes = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.disabledOptions}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledOptions.svelte`}>
    <DisabledOptionsDocsExample {isReachable} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachable"}
            {...SelectKnobs.IS_REACHABLE_TEXT}
        >
            <PageCheckField
                value={isReachable}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachable = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.manyOptions}
/>

<PageDocsExample path={`${DOCS_ROOT}/Virtualized.svelte`}>
    <VirtualizedDocsExample {count} bind:visibility={virtualizedVisibility} />

    <div class={exampleStyles.exampleReadout} data-readout>{measurement}</div>

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"count"}
            {...SelectKnobs.COUNT_TEXT}
        >
            <PageNumberField
                value={count}
                min={SelectKnobs.MIN_STRESS_COUNT}
                max={SelectKnobs.MAX_STRESS_COUNT}
                step={SelectKnobs.STRESS_COUNT_STEP}
                width={STRESS_COUNT_FIELD_WIDTH}
                ariaLabel={"Option count"}
                onInput={(value) => {
                    count = value;
                    openMs = undefined;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.loadedDemand}
/>

<PageDocsExample path={`${DOCS_ROOT}/OnDemand.svelte`}>
    <OnDemandDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.autocomplete}
/>

<PageDocsExample path={`${DOCS_ROOT}/Autocomplete.svelte`}>
    <AutocompleteDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.autocompleteLoadedDemand}
/>

<PageDocsExample path={`${DOCS_ROOT}/AutocompleteOnDemand.svelte`}>
    <AutocompleteOnDemandDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...SelectKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...SelectKnobs.IS_DISABLED_TEXT}
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
