<script lang="ts">
    import { untrack } from "svelte";

    import { FrameRateMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

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
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets SelectProps.hasError"}
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
            label={"Disabled"}
            hint={"Turns the field off: it does not open, and the Tab key skips it."}
            controls={"Sets SelectProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, the pick starts from the right of the field, and the arrow and the clear button sit at its left end."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Clearing the pick"}
    content={"Give it [prop]renderClear[/prop] and a clear button sits at the end of the field, drawn only while something is picked and reached with the Tab key after the field. It needs [prop]clearAriaLabel[/prop] to name it, and pressing it empties the value and reports the change like any other pick."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Clearable.svelte`}>
    <ClearableDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Records as values"}
    content={"An option's value can be any record, not only a string. Here each airport is an object, and the field and the options draw whichever of its parts you choose."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Records.svelte`}>
    <RecordsDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"More than a name"}
    content={"An option draws whatever its painter gives it, here a name with a line of detail beneath it, and is still one option to the arrow keys and to typing."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Described.svelte`}>
    <DescribedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Groups"}
    content={"Options can sit in groups under headings: a screen reader announces the group, and the arrow keys walk past the headings. A box drawn around each group is optional, through [prop]renderGroupBox[/prop]."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Groups.svelte`}>
    <GroupsDocsExample {hasGroupBoxes} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasGroupBoxes"}
            label={"Group boxes"}
            hint={"Draws a box around each group's heading and options."}
            controls={"Passes SelectProps.renderGroupBox, or leaves it out"}
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
    title={"Disabled options"}
    content={"An option can be disabled: the arrow keys and typing skip it, and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it instead, so a tooltip can say why it is off."}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledOptions.svelte`}>
    <DisabledOptionsDocsExample {isReachable} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachable"}
            label={"Reachable when disabled"}
            hint={"Lets the arrow keys stop on the disabled options, which then show a tooltip."}
            controls={"Sets SelectOption.isReachableWhenDisabled on the disabled options"}
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
    title={"Many options"}
    content={"Give it an estimated option height and only the options in view are built, so a list of a hundred thousand opens about as fast as one of fifty. The line under the field shows how long the list took to open and how smoothly it runs while open."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Virtualized.svelte`}>
    <VirtualizedDocsExample {count} bind:visibility={virtualizedVisibility} />

    <div class={exampleStyles.exampleReadout} data-readout>{measurement}</div>

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"count"}
            label={"Option count"}
            hint={"How many options the list holds. Only the ones in view are built."}
            controls={"Sets the number of example options sent to SelectProps.options"}
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
    title={"Loaded on demand"}
    content={"While [prop]hasMoreOptions[/prop] is on, nearing the end of the list calls [prop]onReachEnd[/prop], so options can arrive from a server a batch at a time. The arrow keys stop at the last option held until the next batch lands."}
/>

<PageDocsExample path={`${DOCS_ROOT}/OnDemand.svelte`}>
    <OnDemandDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Autocomplete"}
    content={"Give it a [prop]query[/prop] and the field becomes a text box: the reader types to narrow the list. Which options match is yours to decide, so the filtering lives in your code."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Autocomplete.svelte`}>
    <AutocompleteDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Autocomplete, loaded on demand"}
    content={"The two combine: each change of the query asks the server for its first batch of matches, and nearing the end of the list asks for the next."}
/>

<PageDocsExample path={`${DOCS_ROOT}/AutocompleteOnDemand.svelte`}>
    <AutocompleteOnDemandDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Tooltip"}
    content={"Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and still does not open."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            label={"Reachable when disabled"}
            hint={"Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."}
            controls={"Sets SelectProps.isReachableWhenDisabled"}
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
            label={"Disabled"}
            hint={"Turns the field off: it does not open, and the Tab key skips it."}
            controls={"Sets SelectProps.isDisabled"}
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
    title={"Named by a Label"}
    content={"Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the list."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
