<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import { OTHER_CALENDAR, WEEK_START_LABELS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
} from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import CalendarsDocsExample from "./Docs/Calendars.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TwoMonthsDocsExample from "./Docs/TwoMonths.vue";

const weekStartsOn = shallowRef<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
const isDisabled = shallowRef(false);
const calendarId = shallowRef<DateValueCalendarId>(OTHER_CALENDAR);

const computeWeekStartLabel = (day: DateValueWeekStart) => WEEK_START_LABELS[day];
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :week-starts-on="weekStartsOn" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="weekStartsOn"
                label="Week starts on"
                hint="Which day begins a week, which decides the order of the column headings."
                controls="Sets RangeCalendarProps.weekStartsOn"
            >
                <PageSelectField
                    :value="weekStartsOn"
                    :values="RangeCalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="computeWeekStartLabel"
                    @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the calendar off: no day can be picked, and the Tab key skips it."
                controls="Sets RangeCalendarProps.isDisabled"
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
        content="A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends of the range between them: the days outside are disabled, and the arrow and page keys stop at the edge."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Two months"
        content="Set [prop]monthCount[/prop] to show several months side by side, so a range can start in one and end in the next. The arrow keys walk from one month into the other, the page keys step them all, and [prop]renderMonthHeader[/prop] draws the title over each."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/TwoMonths.vue`">
        <TwoMonthsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Other calendar systems"
        content="The grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in. Here the month is converted to the chosen calendar, and a range picked in one calendar covers the same days in any other."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp
                item-key="calendar"
                label="Calendar"
                hint="Which calendar system the month is drawn in."
                controls="Converts RangeCalendarProps.month to the chosen calendar"
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
        content="Inside a box whose text runs right to left, each week runs from the right, and the left arrow moves on to the next day, which is where it is drawn. Up, down and the page keys keep their meaning."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
