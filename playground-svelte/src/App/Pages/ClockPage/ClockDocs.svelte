<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LimitsDocsExample from "./Docs/Limits.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TwelveHourDocsExample from "./Docs/TwelveHour.svelte";
    import { ClockKnobs } from "@thewaver/ss-playground/App/Knobs/Clocks.const";

    let isDisabled = $state(false);
    let isTwelveHour = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDisabled"}
            {...ClockKnobs.IS_DISABLED_TEXT}
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
            {...ClockKnobs.IS_TWELVE_HOUR_TEXT}
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
    {...DOCS_SECTIONS.everyFifteenMinutesWithin}
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
