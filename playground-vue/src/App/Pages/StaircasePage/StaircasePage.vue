<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { STAIRCASE_DEFAULTS, STAIRCASE_DIRS, StaircaseIndents } from "@thewaver/ss-components-vue";
import type { StaircaseDir } from "@thewaver/ss-components-vue";
import { StaircaseKnobs } from "@thewaver/ss-playground/App/Knobs/Staircases.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import type { StaircaseExampleProps } from "./StaircasePage.types";

const FIELD_WIDTH = 110;
const STAIRCASE_WIDTH = 340;
const EXAMPLES_ROOT = "/src/App/Pages/StaircasePage/Examples";

const STAGES = [
    "Visitors",
    "Signed up",
    "Activated",
    "Subscribed",
    "Renewed",
    "Advocates",
    "Champions",
    "Partners",
    "Investors",
    "Founders",
];

const stepCount = shallowRef(StaircaseKnobs.STARTING_STEP_COUNT);
const indent = shallowRef(StaircaseKnobs.STARTING_INDENT);
const gap = shallowRef(STAIRCASE_DEFAULTS.gap);
const indentKey = shallowRef<StaircaseIndents.SampleKey>(StaircaseKnobs.STARTING_INDENT_KEY);
const dir = shallowRef<StaircaseDir>(STAIRCASE_DEFAULTS.dir);

const steps = computed(() => STAGES.slice(0, stepCount.value));

const commonProps = computed<StaircaseExampleProps>(() => ({
    steps: steps.value,
    indent: indent.value,
    gap: gap.value,
    dir: dir.value,
    indentKey: indentKey.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="stepCount" label="Steps" hint="How many steps the staircase holds.">
            <PageNumberField
                :value="stepCount"
                :min="StaircaseKnobs.MIN_STEP_COUNT"
                :max="StaircaseKnobs.MAX_STEP_COUNT"
                :step="StaircaseKnobs.STEP_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Steps"
                @input="(value: number) => (stepCount = value)"
            />
        </PageProp>

        <PageProp item-key="indent" label="Indent (px)" hint="How far one step is set in from the one before it.">
            <PageNumberField
                :value="indent"
                :min="StaircaseKnobs.MIN_INDENT"
                :max="StaircaseKnobs.MAX_INDENT"
                :step="StaircaseKnobs.INDENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Indent"
                @input="(value: number) => (indent = value)"
            />
        </PageProp>

        <PageProp item-key="gap" label="Gap (px)" hint="The space between one step and the next.">
            <PageNumberField
                :value="gap"
                :min="StaircaseKnobs.MIN_GAP"
                :max="StaircaseKnobs.MAX_GAP"
                :step="StaircaseKnobs.GAP_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Gap"
                @input="(value: number) => (gap = value)"
            />
        </PageProp>

        <PageProp item-key="dir" label="Direction" hint="Which way the staircase runs.">
            <PageSelectField
                :value="dir"
                :values="STAIRCASE_DIRS"
                :width="FIELD_WIDTH"
                ariaLabel="Direction"
                @change="(value: StaircaseDir) => (dir = value)"
            />
        </PageProp>

        <PageProp
            item-key="indentKey"
            label="Indent function"
            hint="How the indent grows down the run: evenly, faster and faster, or in and out again."
        >
            <PageSelectField
                :value="indentKey"
                :values="StaircaseIndents.SAMPLE_KEYS"
                :width="FIELD_WIDTH"
                ariaLabel="Indent function"
                @change="(value: StaircaseIndents.SampleKey) => (indentKey = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <PageMeasureBox :width="STAIRCASE_WIDTH">
                <DefaultExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>
    </PageExamples>
</template>
