<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DateValueUtils } from "@thewaver/ss-components-vue";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
} from "@thewaver/ss-playground/App/Pages/DateRangePickerPage/DateRangePickerPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import CalendarsDocsExample from "./Docs/Calendars.vue";
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
            <PageProp
                item-key="isReadOnly"
                label="Read-only"
                hint="Its dates can be selected and copied, but neither typing nor pasting changes them, and the calendar cannot be opened."
                controls="Sets DateRangePickerProps.isReadOnly"
            >
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks both fields invalid, for screen readers as well as for the painter. Each field also marks itself while what it shows is not a date."
                controls="Sets DateRangePickerProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the picker off: nothing can write to either field, the calendar cannot be opened, and the Tab key skips all three."
                controls="Sets DateRangePickerProps.isDisabled"
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
        title="Earliest and latest date"
        content="A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends between them. The calendar disables the days outside, and a date typed outside them is moved to the nearest of the two once its field is left."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Other calendar systems"
        content="Set [prop]calendar[/prop] and both fields read and write their dates in that calendar system, and the calendar opens on that system's month. The value stays the same two days, as the line under the fields shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp
                item-key="calendar"
                label="Calendar"
                hint="Which calendar system the dates are read and written in."
                controls="Sets DateRangePickerProps.calendar"
            >
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

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the start field sits on the right, where reading starts, the end field and the calendar's trigger on the left, each field's text lines up on the right, and the calendar opens under the right edge of the pair."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a picker [prop]tooltipDefs[/prop] and one tooltip shows over both fields while either is hovered or holds keyboard focus, read by screen readers as the description of whichever field is focused. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its fields can then be focused to read why it is off, and typing still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled picker's tooltip available: the Tab key can stop on its fields and hovering them shows the tooltip. Without it a disabled picker shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets DateRangePickerProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp
                item-key="tooltipIsDisabled"
                label="Disabled"
                hint="Turns the picker off: nothing can write to either field, the calendar cannot be opened, and the Tab key skips all three."
                controls="Sets DateRangePickerProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
