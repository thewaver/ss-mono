<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    MediaQueryMonitorVueUtils,
    SCRAMBLE_TEXT_DEFAULTS,
    ScrambleTextGlyphs,
    ScrambleTextWeights,
} from "@thewaver/ss-components-vue";
import { ScrambleTextKnobs } from "@thewaver/ss-playground/App/Knobs/ScrambleTexts.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import ChangedOnlyExample from "./Examples/ChangedOnly.vue";
import HeadlineExample from "./Examples/Headline.vue";
import SequentialExample from "./Examples/Sequential.vue";
import SwapExample from "./Examples/Swap.vue";
import type { ScrambleTextExampleProps } from "./ScrambleTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ScrambleTextPage/Examples";

const NO_MOTION_DURATION_MS = 0;

const settleDurationMs = shallowRef(SCRAMBLE_TEXT_DEFAULTS.settleDurationMs);
const scrambleIntervalMs = shallowRef(SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs);
const glyphSet = shallowRef<(typeof ScrambleTextKnobs.GLYPH_SETS)[number]>(ScrambleTextKnobs.STARTING_GLYPH_SET);
const settleOrder = shallowRef<(typeof ScrambleTextKnobs.SETTLE_ORDERS)[number]>(
    ScrambleTextKnobs.STARTING_SETTLE_ORDER,
);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const commonProps = computed<ScrambleTextExampleProps>(() => {
    const currentGlyphSet = glyphSet.value;
    const currentSettleOrder = settleOrder.value;

    return {
        settleDurationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : settleDurationMs.value,
        scrambleIntervalMs: scrambleIntervalMs.value,
        computeGlyphs: (character) =>
            currentGlyphSet === "library"
                ? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs()
                : ScrambleTextGlyphs.SAMPLE_GLYPHS[currentGlyphSet](character),
        computeCharacterWeights: (count) =>
            currentSettleOrder === "left_to_right" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[currentSettleOrder](count),
    };
});

const examples: ExampleDefs[] = [
    {
        key: "headline",
        name: "Headline",
        readout: () => "a restart asked for mid-run throws away the run in progress and plays again from the start",
        path: `${EXAMPLES_ROOT}/Headline.vue`,
    },
    {
        key: "sequential",
        name: "Sequential",
        readout: () =>
            "one character at a time, each churning inside its own window and landing before the next starts — which needs a run several times longer than a whole-line churn, or there is no time to see anything happen",
        path: `${EXAMPLES_ROOT}/Sequential.vue`,
    },
    {
        key: "swap",
        name: "Swap",
        readout: () => "nothing asks for a restart here — changing the text is what starts the run",
        path: `${EXAMPLES_ROOT}/Swap.vue`,
    },
    {
        key: "changedOnly",
        name: "Changed Only",
        readout: () =>
            "only what differs from the last text scrambles, and the characters an insertion pushes along stay put",
        path: `${EXAMPLES_ROOT}/ChangedOnly.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="settleDurationMs"
            label="Settle duration (ms)"
            hint="How long the text takes to go from all scrambled to fully settled. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="settleDurationMs"
                :min="ScrambleTextKnobs.MIN_SETTLE_DURATION_MS"
                :max="ScrambleTextKnobs.MAX_SETTLE_DURATION_MS"
                :step="ScrambleTextKnobs.SETTLE_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Settle duration in milliseconds"
                @input="(value: number) => (settleDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="scrambleIntervalMs"
            label="Scramble interval (ms)"
            hint="How often an unsettled character is swapped for another. Shorter intervals make a busier churn."
        >
            <PageNumberField
                :value="scrambleIntervalMs"
                :min="ScrambleTextKnobs.MIN_SCRAMBLE_INTERVAL_MS"
                :max="ScrambleTextKnobs.MAX_SCRAMBLE_INTERVAL_MS"
                :step="ScrambleTextKnobs.SCRAMBLE_INTERVAL_STEP_MS"
                ariaLabel="Scramble interval in milliseconds"
                @input="(value: number) => (scrambleIntervalMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="glyphSet"
            label="Glyphs"
            hint="Which characters the unsettled positions are drawn from. Matched churns a digit among digits and a letter among letters of its own case."
        >
            <PageSelectField
                :value="glyphSet"
                :values="ScrambleTextKnobs.GLYPH_SETS"
                ariaLabel="Glyphs"
                @change="(value: (typeof ScrambleTextKnobs.GLYPH_SETS)[number]) => (glyphSet = value)"
            />
        </PageProp>

        <PageProp
            item-key="settleOrder"
            label="Settle order"
            hint="The order the characters settle in: left to right, from the middle out, at random, and so on."
        >
            <PageSelectField
                :value="settleOrder"
                :values="ScrambleTextKnobs.SETTLE_ORDERS"
                ariaLabel="Settle order"
                @change="(value: (typeof ScrambleTextKnobs.SETTLE_ORDERS)[number]) => (settleOrder = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #headline>
            <HeadlineExample v-bind="commonProps" />
        </template>

        <template #sequential>
            <SequentialExample v-bind="commonProps" />
        </template>

        <template #swap>
            <SwapExample v-bind="commonProps" />
        </template>

        <template #changedOnly>
            <ChangedOnlyExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
