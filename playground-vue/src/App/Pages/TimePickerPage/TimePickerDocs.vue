<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TimePickerPage/TimePickerPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import LimitsDocsExample from "./Docs/Limits.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import TwelveHourDocsExample from "./Docs/TwelveHour.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isTwelveHour = shallowRef(true);
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
                hint="Its time can be selected and copied, but neither typing, pasting nor the arrow keys change it, and the clock cannot be opened."
                controls="Sets TimePickerProps.isReadOnly"
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
                hint="Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a time."
                controls="Sets TimePickerProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the picker off: nothing can write to the field, the clock cannot be opened, and the Tab key skips both."
                controls="Sets TimePickerProps.isDisabled"
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
        title="Twelve hours"
        content="Set [prop]isTwelveHour[/prop] and both the field and the clock read the hours from 1 to 12, the clock with a column for morning and afternoon. The field's own marker is a control you draw in [prop]renderTrailing[/prop], which sits before the clock's trigger. The value underneath stays a 24-hour time, as the line under the field shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/TwelveHour.vue`">
        <TwelveHourDocsExample :is-twelve-hour="isTwelveHour" />

        <template #renderKnobs>
            <PageProp
                item-key="isTwelveHour"
                label="Twelve hour"
                hint="Writes the hours from 1 to 12, with a morning and afternoon marker."
                controls="Sets TimePickerProps.isTwelveHour"
            >
                <PageCheckField
                    :value="isTwelveHour"
                    ariaLabel="Twelve hour"
                    @change="(value: boolean) => (isTwelveHour = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Every fifteen minutes, within opening hours"
        content="Set [prop]clockSteps[/prop] to offer fewer times in a column, here every fifteen minutes. A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range: the clock offers nothing outside them, and a typed time outside them is moved to the nearest of the two once the field is left. Typing is not held to the steps."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Limits.vue`">
        <LimitsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the trailing content and the clock's trigger move to the left, where reading ends, the text lines up on the right, and the clock opens under the field's right edge."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a picker [prop]tooltipDefs[/prop] and its field shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its field can then be focused to read why it is off, and typing still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets TimePickerProps.isReachableWhenDisabled"
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
                hint="Turns the picker off: nothing can write to the field, the clock cannot be opened, and the Tab key skips both."
                controls="Sets TimePickerProps.isDisabled"
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
        content="Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field. The clock's trigger keeps the name [prop]triggerAriaLabel[/prop] gives it, since the label's text names the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
