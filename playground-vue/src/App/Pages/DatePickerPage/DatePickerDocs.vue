<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DateValueUtils } from "@thewaver/ss-components-vue";
import { DatePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DatePickers.const";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import CalendarsDocsExample from "./Docs/Calendars.vue";
import DisabledDaysDocsExample from "./Docs/DisabledDays.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import MonthPickerDocsExample from "./Docs/MonthPicker.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const calendarIds = DateValueUtils.getCalendarIds();

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const calendarId = shallowRef<DateValueCalendarId>(OTHER_CALENDAR);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="DatePickerKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="DatePickerKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="DatePickerKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.earliestLatestDate" />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.unpickableDays" />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledDays.vue`">
        <DisabledDaysDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.pickingMonth" />

    <PageDocsExample :path="`${DOCS_ROOT}/MonthPicker.vue`">
        <MonthPickerDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.otherCalendarSystems" />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp item-key="calendar" v-bind="DatePickerKnobs.CALENDAR_TEXT">
                <PageSelectField
                    :value="calendarId"
                    :values="calendarIds"
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

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="DatePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="DatePickerKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.namedLabel" />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
