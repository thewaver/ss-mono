<script setup lang="ts">
import { shallowRef } from "vue";

import { ProgressKnobs } from "@thewaver/ss-playground/App/Knobs/Progresses.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

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

const value = shallowRef(ProgressKnobs.STARTING_VALUE);
const hasError = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :value="value" :has-error="hasError" />

        <template #renderKnobs>
            <PageProp
                item-key="value"
                label="Value"
                hint="How far along the work is, between 0 and 1, the default range."
                controls="Sets ProgressProps.value"
            >
                <PageNumberField
                    :value="value"
                    :min="ProgressKnobs.MIN_VALUE"
                    :max="ProgressKnobs.MAX_VALUE"
                    :step="ProgressKnobs.VALUE_STEP"
                    ariaLabel="Value"
                    @input="(next: number) => (value = next)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Puts the bar in its error look, for work that has failed rather than finished. Whether it has failed is the owner's to say."
                controls="Sets ProgressProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(next: boolean) => (hasError = next)" />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the bar fills from the right."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Work of unknown length"
        content="Leave [prop]value[/prop] out and the bar is indeterminate. A screen reader hears no number, and the painter is handed no ratio, so it can animate instead."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Indeterminate.vue`">
        <IndeterminateDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Counting in real units"
        content="Set [prop]min[/prop] and [prop]max[/prop] to the units the work is counted in, bytes here, and pass the count straight in; the painter is still handed a ratio from 0 to 1. Where the bare number would mean nothing to a listener, [prop]ariaValueText[/prop] says what to read out instead, shown here under the bar."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/LiveRange.vue`">
        <LiveRangeDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A value past either end"
        content="A value outside [prop]min[/prop] and [prop]max[/prop] is clamped, so the bar is drawn full rather than past its end, and the ratio the painter is handed never leaves 0 to 1. This one is handed 5 against the default range of 0 to 1."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/OutOfRange.vue`">
        <OutOfRangeDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A reading rather than a task"
        content="Set [prop]role[/prop] to meter for a reading of how full something is, disk space here, rather than work that will finish. A screen reader hears it as a gauge, and since a gauge always reads something, [prop]value[/prop] is then required."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DiskMeter.vue`">
        <DiskMeterDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Drawn as a ring"
        content="What the progress looks like is the painter's to decide: here the same upload is drawn round a circle, and nothing about the component changes."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Ring.vue`">
        <RingDocsExample />
    </PageDocsExample>
</template>
