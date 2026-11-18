<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-vue";
import { DateInputKnobs } from "@thewaver/ss-playground/App/Knobs/DateInputs.const";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FORMAT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/DateInputPage/DateInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CalendarsDocsExample from "./Docs/Calendars.vue";
import DayFirstDocsExample from "./Docs/DayFirst.vue";
import EraDocsExample from "./Docs/Era.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const format = shallowRef<DateInputFormat>("day_month_year");
const calendarId = shallowRef<DateValueCalendarId>(OTHER_CALENDAR);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReadOnly" v-bind="DateInputKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="DateInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="DateInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.writtenDayFirst" />

    <PageDocsExample :path="`${DOCS_ROOT}/DayFirst.vue`">
        <DayFirstDocsExample :format="format" />

        <template #renderKnobs>
            <PageProp item-key="format" v-bind="DateInputKnobs.FORMAT_TEXT">
                <PageSelectField
                    :value="format"
                    :values="DATE_INPUT_FORMATS"
                    :width="FORMAT_FIELD_WIDTH"
                    ariaLabel="Format"
                    @change="(value: DateInputFormat) => (format = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.beforeCommonEra" />

    <PageDocsExample :path="`${DOCS_ROOT}/Era.vue`">
        <EraDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.otherCalendarSystems" />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp item-key="calendar" v-bind="DateInputKnobs.CALENDAR_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="DateInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="DateInputKnobs.IS_DISABLED_TEXT">
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
