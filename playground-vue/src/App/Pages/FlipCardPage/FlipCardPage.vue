<script setup lang="ts">
import { shallowRef } from "vue";

import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-vue";
import { FLIP_CARD_AXES, FLIP_CARD_DEFAULTS } from "@thewaver/ss-components-vue";
import { FlipCardKnobs } from "@thewaver/ss-playground/App/Knobs/FlipCards.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PressedExample from "./Examples/Pressed.vue";

const AXIS_LABELS: Record<FlipCardAxis, string> = {
    row: "About the upright axis",
    column: "About the horizontal axis",
};

const FIELD_WIDTH = 110;
const SELECT_WIDTH = 220;
const EXAMPLES_ROOT = "/src/App/Pages/FlipCardPage/Examples";

const axis = shallowRef<FlipCardAxis>(FLIP_CARD_DEFAULTS.axis);
const transitionDurationMs = shallowRef(FLIP_CARD_DEFAULTS.transitionDurationMs);

const pressedFlipped = shallowRef(false);

const lastTurn = shallowRef<FlipCardTurnDirection>();

const examples: ExampleDefs[] = [
    {
        key: "pressed",
        name: "Turned toward the edge pressed",
        readout: () => {
            const side = pressedFlipped.value ? "back" : "front";

            if (!lastTurn.value)
                return `${side} — press an edge to turn the card that way, or slide to lean it without turning`;

            return `${side} — the last turn went ${lastTurn.value}, and the next lean follows it`;
        },
        path: `${EXAMPLES_ROOT}/Pressed.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="axis" label="Axis" hint="Which way the card turns over to show its other side.">
            <PageSelectField
                :value="axis"
                :values="FLIP_CARD_AXES"
                :compute-label="(value: FlipCardAxis) => AXIS_LABELS[value]"
                :width="SELECT_WIDTH"
                ariaLabel="Axis"
                @change="(value: FlipCardAxis) => (axis = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Turn duration (ms)"
            hint="How long one turn from face to face takes."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="FlipCardKnobs.MIN_DURATION_MS"
                :max="FlipCardKnobs.MAX_DURATION_MS"
                :step="FlipCardKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Turn duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #pressed>
            <PressedExample
                v-model:flipped="pressedFlipped"
                :axis="axis"
                :transition-duration-ms="transitionDurationMs"
                @turn="(direction: FlipCardTurnDirection) => (lastTurn = direction)"
            />
        </template>
    </PageExamples>
</template>
