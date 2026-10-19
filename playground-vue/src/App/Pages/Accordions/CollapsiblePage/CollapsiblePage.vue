<script setup lang="ts">
import { shallowRef } from "vue";

import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import FilledExample from "./Examples/Filled.vue";
import PanelExample from "./Examples/Panel.vue";
import SidewaysExample from "./Examples/Sideways.vue";

const transitionDurationMs = shallowRef(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

const panel = shallowRef(false);
const filled = shallowRef(false);
const sideways = shallowRef(false);

const examples: ExampleDefs[] = [
    {
        key: "panel",
        name: EXAMPLE_NAMES.panel,
        readout: () =>
            `expanded: ${panel.value} — one trigger and one panel, with none of the group behavior an accordion adds`,
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "unheld",
        name: EXAMPLE_NAMES.unheld,
        readout: () =>
            "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Panel.vue`,
    },
    {
        key: "filled",
        name: EXAMPLE_NAMES.filled,
        readout: () =>
            `expanded: ${filled.value} — the panel's contents are not built until it is opened, and are kept once they are`,
        path: `${EXAMPLES_ROOT}/Filled.vue`,
    },
    {
        key: "sideways",
        name: EXAMPLE_NAMES.sideways,
        readout: () =>
            `expanded: ${sideways.value} — the panel grows its width instead of its height, and its contents keep theirs`,
        path: `${EXAMPLES_ROOT}/Sideways.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="transitionDurationMs"
            controls="Sets CollapsibleProps.transitionDurationMs"
            label="Transition duration (ms)"
            hint="How long the panel takes to open and close. At 0 it opens and closes at once."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="AccordionKnobs.MIN_TRANSITION_MS"
                :max="AccordionKnobs.MAX_TRANSITION_MS"
                :step="AccordionKnobs.TRANSITION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Transition duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #panel>
            <PanelExample :transition-duration-ms="transitionDurationMs" v-model:expanded="panel" />
        </template>

        <template #unheld>
            <PanelExample :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #filled>
            <FilledExample :transition-duration-ms="transitionDurationMs" v-model:expanded="filled" />
        </template>

        <template #sideways>
            <SidewaysExample :transition-duration-ms="transitionDurationMs" v-model:expanded="sideways" />
        </template>
    </PageExamples>
</template>
