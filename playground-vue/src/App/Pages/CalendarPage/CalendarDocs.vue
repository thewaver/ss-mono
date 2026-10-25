<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId, DateValueMinDaysInFirstWeek, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    OTHER_CALENDAR,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import CalendarsDocsExample from "./Docs/Calendars.vue";
import DisabledDaysDocsExample from "./Docs/DisabledDays.vue";
import MonthPickerDocsExample from "./Docs/MonthPicker.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import WeekNumbersDocsExample from "./Docs/WeekNumbers.vue";
import YearPickerDocsExample from "./Docs/YearPicker.vue";

const weekStartsOn = shallowRef<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
const isDisabled = shallowRef(false);
const numberedWeekStartsOn = shallowRef<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
const minDaysInFirstWeek = shallowRef<DateValueMinDaysInFirstWeek>(CALENDAR_DEFAULTS.minDaysInFirstWeek);
const calendarId = shallowRef<DateValueCalendarId>(OTHER_CALENDAR);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :week-starts-on="weekStartsOn" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="weekStartsOn"
                label="Week starts on"
                hint="Which day begins a week, which decides the order of the column headings."
                controls="Sets CalendarProps.weekStartsOn"
            >
                <PageSelectField
                    :value="weekStartsOn"
                    :values="CalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="(day: DateValueWeekStart) => WEEK_START_LABELS[day]"
                    @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the calendar off: no day can be picked, and the Tab key skips it."
                controls="Sets CalendarProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Earliest and latest day"
        content="A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the pick between them: the days outside are disabled, and the arrow and page keys stop at the edge."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Days that cannot be picked"
        content="List the days to refuse in [prop]disabledDays[/prop]: a date, a span from one date to another, everything before or after a date, or days of the week, here Saturday and Sunday. A rule none of those can describe goes in [prop]computeIsDayDisabled[/prop], which is asked about every day shown, so keep it quick."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledDays.vue`">
        <DisabledDaysDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Week numbers"
        content="Draw [prop]renderWeekNumber[/prop] and each week is headed by its number. Countries count weeks differently, so two settings decide it: [prop]weekStartsOn[/prop], the day a week begins, and [prop]minDaysInFirstWeek[/prop], how many days of the new year the first week must hold. Monday and 4 is ISO 8601, used across most of Europe; Sunday and 1 is the count used in the United States."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/WeekNumbers.vue`">
        <WeekNumbersDocsExample :week-starts-on="numberedWeekStartsOn" :min-days-in-first-week="minDaysInFirstWeek" />

        <template #renderKnobs>
            <PageProp
                item-key="numberedWeekStartsOn"
                label="Week starts on"
                hint="Which day begins a week, which decides the order of the column headings."
                controls="Sets CalendarProps.weekStartsOn"
            >
                <PageSelectField
                    :value="numberedWeekStartsOn"
                    :values="CalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="(day: DateValueWeekStart) => WEEK_START_LABELS[day]"
                    @change="(day: DateValueWeekStart) => (numberedWeekStartsOn = day)"
                />
            </PageProp>

            <PageProp
                item-key="minDaysInFirstWeek"
                label="First week holds"
                hint="How many days of the new year the first week must hold, which decides the week numbers."
                controls="Sets CalendarProps.minDaysInFirstWeek"
            >
                <PageSelectField
                    :value="minDaysInFirstWeek"
                    :values="CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK"
                    ariaLabel="First week holds"
                    :compute-label="(days: DateValueMinDaysInFirstWeek) => `${days} ${days === 1 ? 'day' : 'days'}`"
                    @change="(days: DateValueMinDaysInFirstWeek) => (minDaysInFirstWeek = days)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Picking a month"
        content="Set [prop]precision[/prop] to month and the grid holds the year's months, three to a row. A pick sets the first day of that month, and the page keys step a year."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/MonthPicker.vue`">
        <MonthPickerDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Picking a year"
        content="Set [prop]precision[/prop] to year and the grid holds twelve years, three to a row, and a pick sets the first day of that year. The limits still apply: here only the years from 2019 to 2031 can be picked."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/YearPicker.vue`">
        <YearPickerDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Other calendar systems"
        content="A date carries its own calendar system, and the grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in: its length, its name and its year. Here the month is converted to the chosen calendar, and the picked day stays the same day in any of them."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp
                item-key="calendar"
                label="Calendar"
                hint="Which calendar system the month is drawn in."
                controls="Converts CalendarProps.month to the chosen calendar"
            >
                <PageSelectField
                    :value="calendarId"
                    :values="DateValueUtils.getCalendarIds()"
                    :width="CALENDAR_FIELD_WIDTH"
                    ariaLabel="Calendar"
                    @change="(id: DateValueCalendarId) => (calendarId = id)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, each week runs from the right, and the right arrow moves to the day before, which is where it is drawn. Up, down and the page keys keep their meaning."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
