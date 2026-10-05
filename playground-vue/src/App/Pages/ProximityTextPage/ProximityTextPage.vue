<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { PROXIMITY_TEXT_DEFAULTS } from "@thewaver/ss-components-vue";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BarrelExample from "./Examples/Barrel.vue";
import PaintedExample from "./Examples/Painted.vue";
import PointerExample from "./Examples/Pointer.vue";
import WaveExample from "./Examples/Wave.vue";
import type { ProximityTextExampleProps } from "./ProximityTextPageVue.types";

const EXAMPLES_ROOT = "/src/App/Pages/ProximityTextPage/Examples";
const WIDE_SPAN = 2;

const reachPx = shallowRef(PROXIMITY_TEXT_DEFAULTS.reachPx);
const isDisabled = shallowRef(ProximityTextKnobs.STARTING_IS_DISABLED);

const commonProps = computed<ProximityTextExampleProps>(() => ({
    reachPx: reachPx.value,
    isDisabled: isDisabled.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "pointer",
        name: "Following the pointer",
        span: WIDE_SPAN,
        readout: () =>
            "each letter plays its keyframes held at how near the pointer is; the lines were wrapped for every letter at its heaviest, so the spare room sits at the end of each line while they rest",
        path: `${EXAMPLES_ROOT}/Pointer.vue`,
    },
    {
        key: "wave",
        name: "A weight wave",
        span: WIDE_SPAN,
        readout: () =>
            "a point supplied in place of the pointer, moved across the line on a clock; Stop is the way to halt it that a motion running on its own owes the reader",
        path: `${EXAMPLES_ROOT}/Wave.vue`,
    },
    {
        key: "painted",
        name: "Painted",
        span: WIDE_SPAN,
        readout: () =>
            "PaintedText inside draws the letters; each grows and pushes the rest of its line along, as plain text does, while the line breaks stay put",
        path: `${EXAMPLES_ROOT}/Painted.vue`,
    },
    {
        key: "barrel",
        name: "Inside a barrel",
        span: WIDE_SPAN,
        readout: () =>
            "a point fixed to the middle of the box and measured up and down only, so every letter on a line answers it alike: a line closes up as it reaches the middle and spreads apart again towards either edge, its keyframes running from spread to closed; the lines were wrapped with every letter at its widest, which here is the first frame, so no word jumps from one line to the next as they spread",
        path: `${EXAMPLES_ROOT}/Barrel.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="reachPx"
            label="Reach (px)"
            hint="How far from a letter's middle the point still reaches it. Past it, the letter rests."
        >
            <PageNumberField
                :value="reachPx"
                :min="ProximityTextKnobs.MIN_REACH_PX"
                :max="ProximityTextKnobs.MAX_REACH_PX"
                :step="ProximityTextKnobs.REACH_STEP_PX"
                ariaLabel="Reach in pixels"
                @input="(value: number) => (reachPx = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Rests every letter and stops following the point. It is what a page honoring a reduced-motion preference passes."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #pointer>
            <PageMeasureBox :width="ProximityTextKnobs.BOX_WIDTH" :padding="MEASURE_BOX_PADDING">
                <PointerExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #wave>
            <WaveExample v-bind="commonProps" />
        </template>

        <template #painted>
            <PageMeasureBox :width="ProximityTextKnobs.BOX_WIDTH" :padding="MEASURE_BOX_PADDING">
                <PaintedExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #barrel>
            <PageMeasureBox :width="ProximityTextKnobs.BOX_WIDTH">
                <BarrelExample :is-disabled="isDisabled" />
            </PageMeasureBox>
        </template>
    </PageExamples>
</template>
