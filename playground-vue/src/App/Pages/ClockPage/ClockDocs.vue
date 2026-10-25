<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LimitsDocsExample from "./Docs/Limits.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TwelveHourDocsExample from "./Docs/TwelveHour.vue";

const isDisabled = shallowRef(false);
const isTwelveHour = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the clock off: no time can be picked, and the Tab key skips it."
                controls="Sets ClockProps.isDisabled"
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
        content="Set [prop]isTwelveHour[/prop] and the hour column reads from 12 through 11, starting at midnight, and a column of its own picks the morning or the afternoon. The value underneath stays a 24-hour time, as the line under the clock shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/TwelveHour.vue`">
        <TwelveHourDocsExample :is-twelve-hour="isTwelveHour" />

        <template #renderKnobs>
            <PageProp
                item-key="isTwelveHour"
                label="Twelve hour"
                hint="Reads the hours from 1 to 12, with a column for morning and afternoon."
                controls="Sets ClockProps.isTwelveHour"
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
        content="Set [prop]steps[/prop] to offer fewer times in a column, here every fifteen minutes. A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range: an option is disabled when the time it would pick falls outside them, so with the shop shutting at 17:30, the hour 17 is off whenever the minutes read 45."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Limits.vue`">
        <LimitsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the columns run from the right, so the hours sit on the right, and the left arrow moves on to the next column."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
