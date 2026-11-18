<script setup lang="ts">
import { shallowRef } from "vue";

import { TimeInputKnobs } from "@thewaver/ss-playground/App/Knobs/TimeInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";

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
            <PageProp item-key="isReadOnly" v-bind="TimeInputKnobs.IS_READ_ONLY_TEXT">
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="TimeInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TimeInputKnobs.IS_DISABLED_TEXT">
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
            <PageProp item-key="isTwelveHour" v-bind="TimeInputKnobs.IS_TWELVE_HOUR_TEXT">
                <PageCheckField
                    :value="isTwelveHour"
                    ariaLabel="Twelve hour"
                    @change="(value: boolean) => (isTwelveHour = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.second" />

    <PageDocsExample :path="`${DOCS_ROOT}/Seconds.vue`">
        <SecondsDocsExample :has-seconds="hasSeconds" />

        <template #renderKnobs>
            <PageProp item-key="hasSeconds" v-bind="TimeInputKnobs.HAS_SECONDS_TEXT">
                <PageCheckField
                    :value="hasSeconds"
                    ariaLabel="Seconds"
                    @change="(value: boolean) => (hasSeconds = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.withinOpeningHours" />

    <PageDocsExample :path="`${DOCS_ROOT}/Limits.vue`">
        <LimitsDocsExample />
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
                v-bind="TimeInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="TimeInputKnobs.IS_DISABLED_TEXT">
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
