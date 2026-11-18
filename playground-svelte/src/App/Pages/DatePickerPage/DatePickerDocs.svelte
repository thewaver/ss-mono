<script lang="ts">
    import type { DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DateValueUtils } from "@thewaver/ss-components-svelte";
    import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { DOCS_SECTIONS,
        CALENDAR_FIELD_WIDTH,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import CalendarsDocsExample from "./Docs/Calendars.svelte";
    import DisabledDaysDocsExample from "./Docs/DisabledDays.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import MonthPickerDocsExample from "./Docs/MonthPicker.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { DatePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DatePickers.const";

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
            {...DatePickerKnobs.IS_READ_ONLY_TEXT}
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
            {...DatePickerKnobs.HAS_ERROR_TEXT}
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
            {...DatePickerKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.unpickableDays}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledDays.svelte`}>
    <DisabledDaysDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pickingMonth}
/>

<PageDocsExample path={`${DOCS_ROOT}/MonthPicker.svelte`}>
    <MonthPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.otherCalendarSystems}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            {...DatePickerKnobs.CALENDAR_TEXT}
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
            {...DatePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...DatePickerKnobs.IS_DISABLED_TEXT}
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
