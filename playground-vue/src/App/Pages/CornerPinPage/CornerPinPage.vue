<script setup lang="ts">
import { shallowRef } from "vue";

import { CORNER_PIN_DEFAULTS } from "@thewaver/ss-components-vue";
import { CornerPinKnobs } from "@thewaver/ss-playground/App/Knobs/CornerPins.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CardExample from "./Examples/Card.vue";

const reachRatio = shallowRef(CORNER_PIN_DEFAULTS.reachRatio);

const examples: ExampleDefs[] = [
    {
        key: "card",
        name: EXAMPLE_NAMES.card,
        readout: () =>
            "drag a grip, or tap one and then tap where it should go; Tab reaches each corner as two sliders, across and down, moved with the arrow keys",
        path: `${EXAMPLES_ROOT}/Card.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="reachRatio"
            controls="Sets CornerPinProps.reachRatio"
            label="Reach"
            hint="How far past each edge of the box a corner may be taken, as a share of the box. At 0 every corner stays on or inside the box, so the content can only be squeezed; above it, the content can be stretched beyond its own size too."
        >
            <PageNumberField
                :value="reachRatio"
                :min="CornerPinKnobs.MIN_REACH_RATIO"
                :max="CornerPinKnobs.MAX_REACH_RATIO"
                :step="CornerPinKnobs.REACH_STEP_RATIO"
                :width="FIELD_WIDTH"
                ariaLabel="Reach as a share of the box"
                @input="(value: number) => (reachRatio = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #card>
            <CardExample :reach-ratio="reachRatio" />
        </template>
    </PageExamples>
</template>
