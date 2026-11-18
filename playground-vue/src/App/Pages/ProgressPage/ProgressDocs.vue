<script setup lang="ts">
import { shallowRef } from "vue";

import { ProgressKnobs } from "@thewaver/ss-playground/App/Knobs/Progresses.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DiskMeterDocsExample from "./Docs/DiskMeter.vue";
import IndeterminateDocsExample from "./Docs/Indeterminate.vue";
import LiveRangeDocsExample from "./Docs/LiveRange.vue";
import OutOfRangeDocsExample from "./Docs/OutOfRange.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import RingDocsExample from "./Docs/Ring.vue";
import VerticalDocsExample from "./Docs/Vertical.vue";

const value = shallowRef(ProgressKnobs.STARTING_VALUE);
const hasError = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :value="value" :has-error="hasError" />

        <template #renderKnobs>
            <PageProp item-key="value" v-bind="ProgressKnobs.VALUE_TEXT">
                <PageNumberField
                    :value="value"
                    :min="ProgressKnobs.MIN_VALUE"
                    :max="ProgressKnobs.MAX_VALUE"
                    :step="ProgressKnobs.VALUE_STEP"
                    ariaLabel="Value"
                    @input="(next: number) => (value = next)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="ProgressKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(next: boolean) => (hasError = next)" />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.standingUpright" />

    <PageDocsExample :path="`${DOCS_ROOT}/Vertical.vue`">
        <VerticalDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.workUnknownLength" />

    <PageDocsExample :path="`${DOCS_ROOT}/Indeterminate.vue`">
        <IndeterminateDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.countingRealUnits" />

    <PageDocsExample :path="`${DOCS_ROOT}/LiveRange.vue`">
        <LiveRangeDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.valuePastEitherEnd" />

    <PageDocsExample :path="`${DOCS_ROOT}/OutOfRange.vue`">
        <OutOfRangeDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.readingRatherThanTask" />

    <PageDocsExample :path="`${DOCS_ROOT}/DiskMeter.vue`">
        <DiskMeterDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.drawnRing" />

    <PageDocsExample :path="`${DOCS_ROOT}/Ring.vue`">
        <RingDocsExample />
    </PageDocsExample>
</template>
