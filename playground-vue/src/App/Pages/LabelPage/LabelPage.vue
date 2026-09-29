<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import CaptionFirstExample from "./Examples/CaptionFirst.vue";
import CheckboxLabelExample from "./Examples/CheckboxLabel.vue";
import ColumnExample from "./Examples/Column.vue";
import DisabledExample from "./Examples/Disabled.vue";
import LabelPerRadioExample from "./Examples/LabelPerRadio.vue";
import SuppressedExample from "./Examples/Suppressed.vue";
import type { PlanValue } from "./LabelPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/LabelPage/Examples";

const checked = shallowRef(false);
const toggleOn = shallowRef(true);
const columnChecked = shallowRef(false);
const disabledChecked = shallowRef(true);
const suppressedChecked = shallowRef(false);
const plan = shallowRef<PlanValue>("free");

const examples: ExampleDefs[] = [
    {
        key: "checkbox",
        name: "Checkbox",
        readout: () => `checked: ${checked.value}`,
        path: `${EXAMPLES_ROOT}/CheckboxLabel.vue`,
    },
    {
        key: "toggleCaptionFirst",
        name: "Toggle, caption first",
        readout: () => `on: ${toggleOn.value}`,
        path: `${EXAMPLES_ROOT}/CaptionFirst.vue`,
    },
    {
        key: "column",
        name: "Column",
        readout: () => `checked: ${columnChecked.value}`,
        path: `${EXAMPLES_ROOT}/Column.vue`,
    },
    {
        key: "labelPerRadio",
        name: "One label per radio",
        readout: () => `value: ${plan.value}`,
        path: `${EXAMPLES_ROOT}/LabelPerRadio.vue`,
    },
    {
        key: "suppressed",
        name: "Suppressed aria-label",
        readout: () => `checked: ${suppressedChecked.value} — the caption wins, and the console says so`,
        path: `${EXAMPLES_ROOT}/Suppressed.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `checked: ${disabledChecked.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #checkbox>
            <CheckboxLabelExample v-model:checked="checked" />
        </template>

        <template #toggleCaptionFirst>
            <CaptionFirstExample v-model:checked="toggleOn" />
        </template>

        <template #column>
            <ColumnExample v-model:checked="columnChecked" />
        </template>

        <template #labelPerRadio>
            <LabelPerRadioExample v-model:value="plan" />
        </template>

        <template #suppressed>
            <SuppressedExample v-model:checked="suppressedChecked" />
        </template>

        <template #disabled>
            <DisabledExample v-model:checked="disabledChecked" />
        </template>
    </PageExamples>
</template>
