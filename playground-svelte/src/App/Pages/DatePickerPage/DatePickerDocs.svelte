<script lang="ts">
    import type { DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DateValueUtils } from "@thewaver/ss-components-svelte";
    import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import {
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
            label={"Read-only"}
            hint={"Its date can be selected and copied, but neither typing nor pasting changes it, and the calendar cannot be opened."}
            controls={"Sets DatePickerProps.isReadOnly"}
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
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date."}
            controls={"Sets DatePickerProps.hasError"}
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
            hint={"Turns the picker off: nothing can write to the field, the calendar cannot be opened, and the Tab key skips both."}
            controls={"Sets DatePickerProps.isDisabled"}
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
    title={"Earliest and latest date"}
    content={"A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the date between them. The calendar disables the days outside, and a typed date outside them is kept as typed until the field is left, then moved to the nearest of the two."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Days that cannot be picked"}
    content={"Describe the days that cannot be picked in [prop]disabledDays[/prop], here Saturday and Sunday, or give a rule of your own in [prop]computeIsDayDisabled[/prop]. The field and the calendar refuse the same days: the calendar disables them, and a refused day typed into the field is kept as typed and marked as an error while the value stays where it was, as the line under the field shows."}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledDays.svelte`}>
    <DisabledDaysDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Picking a month"}
    content={"Set [prop]precision[/prop] to month and the calendar holds the year's months instead of a month's days, and a pick there sets the first day of the month. The field still takes a whole date."}
/>

<PageDocsExample path={`${DOCS_ROOT}/MonthPicker.svelte`}>
    <MonthPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Other calendar systems"}
    content={"Set [prop]calendar[/prop] and the field reads and writes the date in that calendar system, and the calendar opens on that system's month. The value stays the same day, as the line under the field shows."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            label={"Calendar"}
            hint={"Which calendar system the date is read and written in."}
            controls={"Sets DatePickerProps.calendar"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the leading content moves to the right, where reading starts, and the calendar's trigger to the left, and the calendar opens under the field's right edge. The date is still written year first, since digits run left to right in either direction."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Tooltip"}
    content={"Give a picker [prop]tooltipDefs[/prop] and its field shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its field can then be focused to read why it is off, and typing still changes nothing."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            label={"Reachable when disabled"}
            hint={"Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."}
            controls={"Sets DatePickerProps.isReachableWhenDisabled"}
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
            hint={"Turns the picker off: nothing can write to the field, the calendar cannot be opened, and the Tab key skips both."}
            controls={"Sets DatePickerProps.isDisabled"}
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
    content={"Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field. The calendar's trigger keeps the name [prop]triggerAriaLabel[/prop] gives it, since the label's text names the field."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
