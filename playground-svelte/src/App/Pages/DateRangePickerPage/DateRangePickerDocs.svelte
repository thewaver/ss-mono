<script lang="ts">
    import type { DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DateValueUtils } from "@thewaver/ss-components-svelte";
    import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { DOCS_SECTIONS,
        CALENDAR_FIELD_WIDTH,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/DateRangePickerPage/DateRangePickerPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import CalendarsDocsExample from "./Docs/Calendars.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { DateRangePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DateRangePickers.const";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let calendarId = $state<DateValueCalendarId>(OTHER_CALENDAR);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            {...DateRangePickerKnobs.IS_READ_ONLY_TEXT}
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
            {...DateRangePickerKnobs.HAS_ERROR_TEXT}
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
            {...DateRangePickerKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.earliestLatestDate}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.otherCalendarSystems}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            {...DateRangePickerKnobs.CALENDAR_TEXT}
        >
            <PageSelectField
                value={calendarId}
                values={DateValueUtils.getCalendarIds()}
                width={CALENDAR_FIELD_WIDTH}
                ariaLabel={"Calendar"}
                onChange={(id) => {
                    calendarId = id;
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
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...DateRangePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...DateRangePickerKnobs.IS_DISABLED_TEXT}
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
