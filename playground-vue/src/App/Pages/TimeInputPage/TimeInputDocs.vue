<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import LimitsDocsExample from "./Docs/Limits.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SecondsDocsExample from "./Docs/Seconds.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import TwelveHourDocsExample from "./Docs/TwelveHour.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isTwelveHour = shallowRef(true);
const hasSeconds = shallowRef(true);
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
                hint="Its time can be selected and copied, but neither typing, pasting nor the arrow keys change it."
                controls="Sets TimeInputProps.isReadOnly"
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
                controls="Sets TimeInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets TimeInputProps.isDisabled"
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
        content="Set [prop]isTwelveHour[/prop] and the hours are written from 1 to 12, with the morning or afternoon decided by a control you draw in [prop]renderTrailing[/prop], which is handed the field's reading of it and a way to switch it. The value underneath stays a 24-hour time, as the line under the field shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/TwelveHour.vue`">
        <TwelveHourDocsExample :is-twelve-hour="isTwelveHour" />

        <template #renderKnobs>
            <PageProp
                item-key="isTwelveHour"
                label="Twelve hour"
                hint="Writes the hours from 1 to 12, with a morning and afternoon marker."
                controls="Sets TimeInputProps.isTwelveHour"
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
        title="To the second"
        content="Set [prop]hasSeconds[/prop] and the field takes a third part, the seconds, which the arrow keys step like the others. Without it the value is a time to the minute."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Seconds.vue`">
        <SecondsDocsExample :has-seconds="hasSeconds" />

        <template #renderKnobs>
            <PageProp
                item-key="hasSeconds"
                label="Seconds"
                hint="Adds the seconds to the hours and minutes."
                controls="Sets TimeInputProps.hasSeconds"
            >
                <PageCheckField
                    :value="hasSeconds"
                    ariaLabel="Seconds"
                    @change="(value: boolean) => (hasSeconds = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Within opening hours"
        content="A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range. The arrow keys stop at them, and a typed time outside them is kept as typed until the field is left, then moved to the nearest of the two."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Limits.vue`">
        <LimitsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the trailing content moves to the left, where reading ends, and the text lines up on the right. The time itself is still written hours first, since digits run left to right in either direction."
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
                controls="Sets TimeInputProps.isReachableWhenDisabled"
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
                controls="Sets TimeInputProps.isDisabled"
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
