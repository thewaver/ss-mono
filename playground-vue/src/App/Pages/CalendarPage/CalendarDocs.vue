<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId, DateValueMinDaysInFirstWeek, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
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

const computeWeekStartLabel = (day: DateValueWeekStart) => WEEK_START_LABELS[day];
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :week-starts-on="weekStartsOn" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="weekStartsOn" v-bind="CalendarKnobs.WEEK_STARTS_ON_TEXT">
                <PageSelectField
                    :value="weekStartsOn"
                    :values="CalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="computeWeekStartLabel"
                    @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="CalendarKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.earliestLatestDay" />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.unpickableDays" />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledDays.vue`">
        <DisabledDaysDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.weekNumbers" />

    <PageDocsExample :path="`${DOCS_ROOT}/WeekNumbers.vue`">
        <WeekNumbersDocsExample :week-starts-on="numberedWeekStartsOn" :min-days-in-first-week="minDaysInFirstWeek" />

        <template #renderKnobs>
            <PageProp item-key="numberedWeekStartsOn" v-bind="CalendarKnobs.WEEK_STARTS_ON_TEXT">
                <PageSelectField
                    :value="numberedWeekStartsOn"
                    :values="CalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="computeWeekStartLabel"
                    @change="(day: DateValueWeekStart) => (numberedWeekStartsOn = day)"
                />
            </PageProp>

            <PageProp item-key="minDaysInFirstWeek" v-bind="CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.pickingMonth" />

    <PageDocsExample :path="`${DOCS_ROOT}/MonthPicker.vue`">
        <MonthPickerDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.pickingYear" />

    <PageDocsExample :path="`${DOCS_ROOT}/YearPicker.vue`">
        <YearPickerDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.otherCalendarSystems" />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp item-key="calendar" v-bind="CalendarKnobs.CALENDAR_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
