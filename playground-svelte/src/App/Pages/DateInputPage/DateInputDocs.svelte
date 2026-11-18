<script lang="ts">
    import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { DOCS_SECTIONS,
        CALENDAR_FIELD_WIDTH,
        DOCS_ROOT,
        FORMAT_FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/DateInputPage/DateInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CalendarsDocsExample from "./Docs/Calendars.svelte";
    import DayFirstDocsExample from "./Docs/DayFirst.svelte";
    import EraDocsExample from "./Docs/Era.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { DateInputKnobs } from "@thewaver/ss-playground/App/Knobs/DateInputs.const";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let format = $state<DateInputFormat>("day_month_year");
    let calendarId = $state<DateValueCalendarId>(OTHER_CALENDAR);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            {...DateInputKnobs.IS_READ_ONLY_TEXT}
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
            {...DateInputKnobs.HAS_ERROR_TEXT}
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
            {...DateInputKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.writtenDayFirst}
/>

<PageDocsExample path={`${DOCS_ROOT}/DayFirst.svelte`}>
    <DayFirstDocsExample {format} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"format"}
            {...DateInputKnobs.FORMAT_TEXT}
        >
            <PageSelectField
                value={format}
                values={DATE_INPUT_FORMATS}
                width={FORMAT_FIELD_WIDTH}
                ariaLabel={"Format"}
                onChange={(next) => {
                    format = next;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.beforeCommonEra}
/>

<PageDocsExample path={`${DOCS_ROOT}/Era.svelte`}>
    <EraDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.otherCalendarSystems}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            {...DateInputKnobs.CALENDAR_TEXT}
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
            {...DateInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
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
            {...DateInputKnobs.IS_DISABLED_TEXT}
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
