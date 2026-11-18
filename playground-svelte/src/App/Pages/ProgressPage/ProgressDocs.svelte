<script lang="ts">
    import { ProgressKnobs } from "@thewaver/ss-playground/App/Knobs/Progresses.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DiskMeterDocsExample from "./Docs/DiskMeter.svelte";
    import IndeterminateDocsExample from "./Docs/Indeterminate.svelte";
    import LiveRangeDocsExample from "./Docs/LiveRange.svelte";
    import OutOfRangeDocsExample from "./Docs/OutOfRange.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import RingDocsExample from "./Docs/Ring.svelte";
    import VerticalDocsExample from "./Docs/Vertical.svelte";

    let value = $state(ProgressKnobs.STARTING_VALUE);
    let hasError = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {value} {hasError} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"value"}
            {...ProgressKnobs.VALUE_TEXT}
        >
            <PageNumberField
                {value}
                min={ProgressKnobs.MIN_VALUE}
                max={ProgressKnobs.MAX_VALUE}
                step={ProgressKnobs.VALUE_STEP}
                ariaLabel={"Value"}
                onInput={(next) => {
                    value = next;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            {...ProgressKnobs.HAS_ERROR_TEXT}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(next) => {
                    hasError = next;
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
    {...DOCS_SECTIONS.standingUpright}
/>

<PageDocsExample path={`${DOCS_ROOT}/Vertical.svelte`}>
    <VerticalDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.workUnknownLength}
/>

<PageDocsExample path={`${DOCS_ROOT}/Indeterminate.svelte`}>
    <IndeterminateDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.countingRealUnits}
/>

<PageDocsExample path={`${DOCS_ROOT}/LiveRange.svelte`}>
    <LiveRangeDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.valuePastEitherEnd}
/>

<PageDocsExample path={`${DOCS_ROOT}/OutOfRange.svelte`}>
    <OutOfRangeDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.readingRatherThanTask}
/>

<PageDocsExample path={`${DOCS_ROOT}/DiskMeter.svelte`}>
    <DiskMeterDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.drawnRing}
/>

<PageDocsExample path={`${DOCS_ROOT}/Ring.svelte`}>
    <RingDocsExample />
</PageDocsExample>
