<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SCROLLER_DEFAULTS } from "@thewaver/ss-components-vue";
import type { Tab } from "@thewaver/ss-components-vue";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    MONTHS,
    PERCENT,
    getMonthPanelId,
    getMonthTabId,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import ChipsExample from "./Examples/Chips.vue";
import FocusableChildrenExample from "./Examples/FocusableChildren.vue";
import TabbedExample from "./Examples/Tabbed.vue";

const itemCount = shallowRef(ScrollerKnobs.STARTING_ITEM_COUNT);
const selectedMonth = shallowRef(MONTHS[0]);
const overlapCount = shallowRef(SCROLLER_DEFAULTS.overlapCount);
const progress = shallowRef(0);

const labels = computed(() => Array.from({ length: itemCount.value }, (_, index) => `Item ${index + 1}`));

const monthTabs = computed((): Tab<string>[] =>
    MONTHS.slice(0, itemCount.value).map((month) => ({
        value: month,
        id: getMonthTabId(month),
        panelId: getMonthPanelId(month),
    })),
);

const examples: ExampleDefs[] = [
    {
        key: "split",
        name: EXAMPLE_NAMES.split,
        readout: () =>
            `${itemCount.value} items, ${Math.round(progress.value * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
        path: `${EXAMPLES_ROOT}/Chips.vue`,
    },
    {
        key: "bothButtonsEnd",
        name: EXAMPLE_NAMES.bothButtonsEnd,
        readout: () => "the same control with its buttons together instead of split",
        path: `${EXAMPLES_ROOT}/Chips.vue`,
    },
    {
        key: "bothButtonsStart",
        name: EXAMPLE_NAMES.bothButtonsStart,
        readout: () => "and the same pair on the other side",
        path: `${EXAMPLES_ROOT}/Chips.vue`,
    },
    {
        key: "tabbed",
        name: EXAMPLE_NAMES.tabbed,
        readout: () =>
            `selected: ${selectedMonth.value} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
        path: `${EXAMPLES_ROOT}/Tabbed.vue`,
    },
    {
        key: "focusableChildren",
        name: EXAMPLE_NAMES.focusableChildren,
        readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
        path: `${EXAMPLES_ROOT}/FocusableChildren.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="itemCount"
                controls="Sets the number of example items sent as Scroller's children"
                label="Item count"
                hint="How many items sit in the scrolling strip."
            >
                <PageNumberField
                    :value="itemCount"
                    :min="ScrollerKnobs.MIN_ITEM_COUNT"
                    :max="ScrollerKnobs.MAX_ITEM_COUNT"
                    :step="ScrollerKnobs.ITEM_COUNT_STEP"
                    ariaLabel="Item count"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="overlapCount"
                controls="Sets ScrollerProps.overlapCount"
                label="Overlap count"
                hint="How many of the items in view stay in view after a press of a step button. At 0 a press moves on by as much as fits; a press always moves by at least one item."
            >
                <PageNumberField
                    :value="overlapCount"
                    :min="ScrollerKnobs.MIN_OVERLAP_COUNT"
                    :max="ScrollerKnobs.MAX_OVERLAP_COUNT"
                    :step="ScrollerKnobs.OVERLAP_COUNT_STEP"
                    ariaLabel="Overlap count"
                    @input="(value: number) => (overlapCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="position"
                controls="Sets ScrollerProps.progress, shown as a percentage"
                label="First strip (%)"
                hint="How far through its run the first strip is scrolled, as a percentage."
            >
                <PageNumberField
                    :value="Math.round(progress * PERCENT)"
                    :min="ScrollerKnobs.MIN_POSITION"
                    :max="PERCENT"
                    :step="ScrollerKnobs.POSITION_STEP"
                    ariaLabel="First strip position"
                    @input="(value: number) => (progress = value / PERCENT)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" :min-column-width="400">
            <template #split>
                <ChipsExample v-model:progress="progress" :labels="labels" :overlap-count="overlapCount" />
            </template>

            <template #bothButtonsEnd>
                <ChipsExample :labels="labels" :overlap-count="overlapCount" button-placement="end" />
            </template>

            <template #bothButtonsStart>
                <ChipsExample :labels="labels" :overlap-count="overlapCount" button-placement="start" />
            </template>

            <template #tabbed>
                <TabbedExample
                    :tabs="monthTabs"
                    :selected-value="selectedMonth"
                    @selection-change="(value: string) => (selectedMonth = value)"
                />
            </template>

            <template #focusableChildren>
                <FocusableChildrenExample :labels="labels" :overlap-count="overlapCount" />
            </template>
        </PageExamples>
    </div>
</template>
