<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import { OTHER_CALENDAR, WEEK_START_LABELS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
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
            <PageProp item-key="weekStartsOn" v-bind="RangeCalendarKnobs.WEEK_STARTS_ON_TEXT">
                <PageSelectField
                    :value="weekStartsOn"
                    :values="RangeCalendarKnobs.WEEK_STARTS"
                    ariaLabel="Week starts on"
                    :compute-label="computeWeekStartLabel"
                    @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="RangeCalendarKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.twoMonths" />

    <PageDocsExample :path="`${DOCS_ROOT}/TwoMonths.vue`">
        <TwoMonthsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.otherCalendarSystems" />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp item-key="calendar" v-bind="RangeCalendarKnobs.CALENDAR_TEXT">
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
