<script setup lang="ts">
import { shallowRef } from "vue";

import { ClockKnobs } from "@thewaver/ss-playground/App/Knobs/Clocks.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

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
            <PageProp item-key="isDisabled" v-bind="ClockKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.twelveHours" />

    <PageDocsExample :path="`${DOCS_ROOT}/TwelveHour.vue`">
        <TwelveHourDocsExample :is-twelve-hour="isTwelveHour" />

        <template #renderKnobs>
            <PageProp item-key="isTwelveHour" v-bind="ClockKnobs.IS_TWELVE_HOUR_TEXT">
                <PageCheckField
                    :value="isTwelveHour"
                    ariaLabel="Twelve hour"
                    @change="(value: boolean) => (isTwelveHour = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.everyFifteenMinutesWithin" />

    <PageDocsExample :path="`${DOCS_ROOT}/Limits.vue`">
        <LimitsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
