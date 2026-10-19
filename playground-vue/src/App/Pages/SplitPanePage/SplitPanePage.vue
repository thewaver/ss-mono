<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, SPLIT_PANE_DEFAULTS } from "@thewaver/ss-components-vue";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    GUTTER_FIELD_WIDTH,
    PERCENT,
    STARTING_BOUNDED,
    STARTING_COLUMN,
    STARTING_COMPARE,
    STARTING_CRAMPED,
    STARTING_PAIR,
    STARTING_RIGHT_TO_LEFT,
    STARTING_TRIPLE,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import BoundedExample from "./Examples/Bounded.vue";
import CompareExample from "./Examples/Compare.vue";
import CrampedExample from "./Examples/Cramped.vue";
import PairExample from "./Examples/Pair.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import StackedExample from "./Examples/Stacked.vue";
import TripleExample from "./Examples/Triple.vue";
import type { SplitPaneExampleProps } from "./SplitPanePage.types";

const percent = (ratios: number[]) => ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ");

const gutterSize = shallowRef(SPLIT_PANE_DEFAULTS.gutterSize);
const isDisabled = shallowRef(SplitPaneKnobs.STARTING_IS_DISABLED);

const pair = shallowRef(STARTING_PAIR);
const rightToLeft = shallowRef(STARTING_RIGHT_TO_LEFT);
const bounded = shallowRef(STARTING_BOUNDED);
const cramped = shallowRef(STARTING_CRAMPED);
const triple = shallowRef(STARTING_TRIPLE);
const column = shallowRef(STARTING_COLUMN);
const compare = shallowRef(STARTING_COMPARE);

const reset = () => {
    pair.value = STARTING_PAIR;
    rightToLeft.value = STARTING_RIGHT_TO_LEFT;
    bounded.value = STARTING_BOUNDED;
    cramped.value = STARTING_CRAMPED;
    triple.value = STARTING_TRIPLE;
    column.value = STARTING_COLUMN;
    compare.value = STARTING_COMPARE;
};

const commonProps = computed((): Pick<SplitPaneExampleProps, "gutterSize" | "isDisabled"> => ({
    gutterSize: gutterSize.value,
    isDisabled: isDisabled.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "pair",
        name: EXAMPLE_NAMES.pair,
        readout: () => `ratios: ${percent(pair.value)} — drag the gutter or arrow it with the keyboard`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "rightToLeft",
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `ratios: ${percent(rightToLeft.value)} — the box around the panes sets dir="rtl", so the first pane sits on the right and the gutter follows the pointer and the arrow keys from that side`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "bounded",
        name: EXAMPLE_NAMES.bounded,
        readout: () =>
            `ratios: ${percent(bounded.value)} — the first pane is held between 120px and 220px whatever the ratio says`,
        path: `${EXAMPLES_ROOT}/Bounded.vue`,
    },
    {
        key: "triple",
        name: EXAMPLE_NAMES.triple,
        readout: () => `ratios: ${percent(triple.value)} — a gutter moves its two neighbors and nothing else`,
        path: `${EXAMPLES_ROOT}/Triple.vue`,
    },
    {
        key: "stacked",
        name: EXAMPLE_NAMES.stacked,
        readout: () => `ratios: ${percent(column.value)} — the same control on the other axis`,
        path: `${EXAMPLES_ROOT}/Stacked.vue`,
    },
    {
        key: "compare",
        name: EXAMPLE_NAMES.compare,
        readout: () =>
            `ratios: ${percent(compare.value)} — both pictures are drawn at the full width of the frame, so the gutter wipes between them instead of squeezing them`,
        path: `${EXAMPLES_ROOT}/Compare.vue`,
    },
    {
        key: "cramped",
        name: EXAMPLE_NAMES.cramped,
        readout: () =>
            `minimums of 250px and 400px in a box too narrow for both — grid honors the floors and lets the row overflow, which is the behavior this control inherits rather than fights`,
        path: `${EXAMPLES_ROOT}/Cramped.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="gutterSize"
            controls="Sets SplitPaneProps.gutterSize"
            label="Gutter size (px)"
            hint="How wide the draggable divider between two panes is."
        >
            <PageNumberField
                :value="gutterSize"
                :min="SplitPaneKnobs.MIN_GUTTER"
                :max="SplitPaneKnobs.MAX_GUTTER"
                :step="SplitPaneKnobs.GUTTER_STEP"
                :width="GUTTER_FIELD_WIDTH"
                ariaLabel="Gutter size in pixels"
                @input="(value: number) => (gutterSize = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            controls="Sets SplitPaneProps.isDisabled"
            label="Disabled"
            hint="Turns the dividers off, so the panes keep the sizes they have."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="ratios"
            controls="Writes the starting sizes back to SplitPaneProps.ratios"
            label="Ratios"
            hint="Puts the panes back to the sizes they started at."
        >
            <Button @click="async () => reset()">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="400">
        <template #pair>
            <PairExample v-bind="commonProps" v-model:ratios="pair" />
        </template>

        <template #rightToLeft>
            <RightToLeftExample v-bind="commonProps" v-model:ratios="rightToLeft" />
        </template>

        <template #bounded>
            <BoundedExample v-bind="commonProps" v-model:ratios="bounded" />
        </template>

        <template #triple>
            <TripleExample v-bind="commonProps" v-model:ratios="triple" />
        </template>

        <template #stacked>
            <StackedExample v-bind="commonProps" v-model:ratios="column" />
        </template>

        <template #compare>
            <CompareExample v-bind="commonProps" v-model:ratios="compare" />
        </template>

        <template #cramped>
            <CrampedExample v-bind="commonProps" v-model:ratios="cramped" />
        </template>
    </PageExamples>
</template>
