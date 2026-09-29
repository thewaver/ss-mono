<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { DIE_DEFAULTS, DieShapes, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { DieKnobs } from "@thewaver/ss-playground/App/Knobs/Dice.const";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import TabletopExample from "./Examples/Tabletop.vue";

const EXAMPLES_ROOT = "/src/App/Pages/DiePage/Examples";

const DIE_SIZE = 160;
const NO_MOTION_DURATION_MS = 0;
const FIRST_NUMBER = 1;

const shapeKey = shallowRef<DieShapes.SampleKey>(DieKnobs.STARTING_SHAPE_KEY);
const rollDurationMs = shallowRef(DIE_DEFAULTS.rollDurationMs);
const tumbleCount = shallowRef(DIE_DEFAULTS.tumbleCount);

const dieFace = shallowRef(0);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const shownRollDurationMs = computed(() => (prefersReducedMotion.value ? NO_MOTION_DURATION_MS : rollDurationMs.value));

const examples: ExampleDefs[] = [
    {
        key: "tabletop",
        name: "Tabletop die",
        readout: () =>
            `showing ${dieFace.value + FIRST_NUMBER} of ${DieShapes.SAMPLE_SHAPES[shapeKey.value].faces.length} — the page picks the number, and the die tumbles and lands on it`,
        path: `${EXAMPLES_ROOT}/Tabletop.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="shape" label="Die" hint="Which die to roll, from four faces to a hundred.">
            <PageSelectField
                :value="shapeKey"
                :values="DieShapes.SAMPLE_KEYS"
                ariaLabel="Die"
                @change="(key: DieShapes.SampleKey) => (shapeKey = key)"
            />
        </PageProp>

        <PageProp
            item-key="rollDurationMs"
            label="Roll duration (ms)"
            hint="How long a roll takes to land. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="rollDurationMs"
                :min="DieKnobs.MIN_ROLL_DURATION_MS"
                :max="DieKnobs.MAX_ROLL_DURATION_MS"
                :step="DieKnobs.ROLL_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Roll duration in milliseconds"
                @input="(value: number) => (rollDurationMs = value)"
            />
        </PageProp>

        <PageProp item-key="tumbleCount" label="Tumbles" hint="How many whole turns a roll makes on its way.">
            <PageNumberField
                :value="tumbleCount"
                :min="DieKnobs.MIN_TUMBLE_COUNT"
                :max="DieKnobs.MAX_TUMBLE_COUNT"
                :step="DieKnobs.TUMBLE_COUNT_STEP"
                ariaLabel="Tumbles"
                @input="(value: number) => (tumbleCount = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #tabletop>
            <TabletopExample
                v-model:face="dieFace"
                :shape="DieShapes.SAMPLE_SHAPES[shapeKey]"
                :size="DIE_SIZE"
                :roll-duration-ms="shownRollDurationMs"
                :tumble-count="tumbleCount"
            />
        </template>
    </PageExamples>
</template>
