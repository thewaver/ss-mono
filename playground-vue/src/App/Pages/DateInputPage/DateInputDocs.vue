<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-vue";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
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
            <PageProp
                item-key="isReadOnly"
                label="Read-only"
                hint="Its date can be selected and copied, but neither typing nor pasting changes it."
                controls="Sets DateInputProps.isReadOnly"
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
                hint="Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date."
                controls="Sets DateInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets DateInputProps.isDisabled"
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
        title="Written day first"
        content="The parts of the date are typed in the order [prop]format[/prop] names: year first by default, or day first, or month first. Only digits are typed, and the field adds each separator as soon as the part before it is complete. The value is the same date in any order, as the line under the field shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DayFirst.vue`">
        <DayFirstDocsExample :format="format" />

        <template #renderKnobs>
            <PageProp
                item-key="format"
                label="Format"
                hint="The order the parts of the date are typed in, and the separator between them."
                controls="Sets DateInputProps.format"
            >
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

    <PageDocsSection
        title="Before the common era"
        content="A date carries its era, and the digits typed cannot say which one it is. Draw a control in [prop]renderLeading[/prop], which is handed the date's era, the eras its calendar offers and a way to change it, and this date of 44 BC can be moved to AD and back."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Era.vue`">
        <EraDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Other calendar systems"
        content="Set [prop]calendar[/prop] and the date is read and written in that calendar system while the value stays the same day, as the line under the field shows. A calendar with one era, such as the Hebrew one, gives the era control nothing to offer, so it is not drawn."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Calendars.vue`">
        <CalendarsDocsExample :calendar="calendarId" />

        <template #renderKnobs>
            <PageProp
                item-key="calendar"
                label="Calendar"
                hint="Which calendar system the date is read and written in."
                controls="Sets DateInputProps.calendar"
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
        content="Inside a box whose text runs right to left, the leading content moves to the right, where reading starts, and the text lines up on the right. The date is still written year first, since digits run left to right in either direction."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets DateInputProps.isReachableWhenDisabled"
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
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets DateInputProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Named by a Label"
        content="Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
