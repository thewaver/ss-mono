<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-vue";
import type { ScrollerOverflow, ScrollerProgress, Tab } from "@thewaver/ss-components-vue";
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
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import ArchedExample from "./Examples/Arched.vue";
import BothWaysExample from "./Examples/BothWays.vue";
import ChipsExample from "./Examples/Chips.vue";
import FocusableChildrenExample from "./Examples/FocusableChildren.vue";
import ShortTrackExample from "./Examples/ShortTrack.vue";
import TabbedExample from "./Examples/Tabbed.vue";
import VerticalStripExample from "./Examples/VerticalStrip.vue";

const itemCount = shallowRef(ScrollerKnobs.STARTING_ITEM_COUNT);
const selectedMonth = shallowRef(MONTHS[0]);
const overlapCount = shallowRef(SCROLLER_DEFAULTS.overlapCount);
const overflowX = shallowRef<ScrollerOverflow>(SCROLLER_DEFAULTS.overflowX);
const overflowY = shallowRef<ScrollerOverflow>("auto");
const isAutoHiding = shallowRef(SCROLLER_DEFAULTS.isAutoHiding);
const isBarOverlaid = shallowRef(SCROLLER_DEFAULTS.isBarOverlaid);
const hideDelayMs = shallowRef(SCROLLER_DEFAULTS.hideDelayMs);
const progress = shallowRef<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);

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
            `${itemCount.value} items, ${Math.round(progress.value.x * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
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
    {
        key: "verticalStrip",
        name: EXAMPLE_NAMES.verticalStrip,
        readout: () =>
            "scrolls down only, so the children stack in a column, the step buttons sit above and below, and the drawn bar keeps a strip of its own on the inline end",
        path: `${EXAMPLES_ROOT}/VerticalStrip.vue`,
    },
    {
        key: "bothWays",
        name: EXAMPLE_NAMES.bothWays,
        readout: () =>
            `across: ${overflowX.value}, down: ${overflowY.value} — one pair of step buttons and one bar per direction, with the corner where the bars meet left empty`,
        path: `${EXAMPLES_ROOT}/BothWays.vue`,
    },
    {
        key: "overlaidAutoHiding",
        name: EXAMPLE_NAMES.overlaidAutoHiding,
        readout: () =>
            `the bar floats over the content's edge and fades ${hideDelayMs.value}ms after scrolling stops, coming back while the pointer moves over the box`,
        path: `${EXAMPLES_ROOT}/VerticalStrip.vue`,
    },
    {
        key: "shortTrack",
        name: EXAMPLE_NAMES.shortTrack,
        readout: () =>
            "the painter draws a short track; a press on it pages towards the press and keeps paging while held, and with Alt (Option on a Mac) it jumps there instead",
        path: `${EXAMPLES_ROOT}/ShortTrack.vue`,
    },
    {
        key: "arched",
        name: EXAMPLE_NAMES.arched,
        readout: () =>
            "the track is an arc, and computeProgressAtPoint reads the pointer by its angle, so the thumb follows the pointer round the curve",
        path: `${EXAMPLES_ROOT}/Arched.vue`,
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
                    :value="Math.round(progress.x * PERCENT)"
                    :min="ScrollerKnobs.MIN_POSITION"
                    :max="PERCENT"
                    :step="ScrollerKnobs.POSITION_STEP"
                    ariaLabel="First strip position"
                    @input="(value: number) => (progress = { ...progress, x: value / PERCENT })"
                />
            </PageProp>

            <PageProp
                item-key="overflowX"
                :controls="ScrollerKnobs.OVERFLOW_X.controls"
                :label="ScrollerKnobs.OVERFLOW_X.label"
                :hint="ScrollerKnobs.OVERFLOW_X.hint"
            >
                <PageSelectField
                    :value="overflowX"
                    :values="SCROLLER_OVERFLOWS"
                    :ariaLabel="ScrollerKnobs.OVERFLOW_X.label"
                    @change="(value: ScrollerOverflow) => (overflowX = value)"
                />
            </PageProp>

            <PageProp
                item-key="overflowY"
                :controls="ScrollerKnobs.OVERFLOW_Y.controls"
                :label="ScrollerKnobs.OVERFLOW_Y.label"
                :hint="ScrollerKnobs.OVERFLOW_Y.hint"
            >
                <PageSelectField
                    :value="overflowY"
                    :values="SCROLLER_OVERFLOWS"
                    :ariaLabel="ScrollerKnobs.OVERFLOW_Y.label"
                    @change="(value: ScrollerOverflow) => (overflowY = value)"
                />
            </PageProp>

            <PageProp
                item-key="isAutoHiding"
                :controls="ScrollerKnobs.IS_AUTO_HIDING.controls"
                :label="ScrollerKnobs.IS_AUTO_HIDING.label"
                :hint="ScrollerKnobs.IS_AUTO_HIDING.hint"
            >
                <PageCheckField
                    :value="isAutoHiding"
                    :ariaLabel="ScrollerKnobs.IS_AUTO_HIDING.label"
                    @change="(value: boolean) => (isAutoHiding = value)"
                />
            </PageProp>

            <PageProp
                item-key="isBarOverlaid"
                :controls="ScrollerKnobs.IS_BAR_OVERLAID.controls"
                :label="ScrollerKnobs.IS_BAR_OVERLAID.label"
                :hint="ScrollerKnobs.IS_BAR_OVERLAID.hint"
            >
                <PageCheckField
                    :value="isBarOverlaid"
                    :ariaLabel="ScrollerKnobs.IS_BAR_OVERLAID.label"
                    @change="(value: boolean) => (isBarOverlaid = value)"
                />
            </PageProp>

            <PageProp
                item-key="hideDelayMs"
                :controls="ScrollerKnobs.HIDE_DELAY_MS.controls"
                :label="ScrollerKnobs.HIDE_DELAY_MS.label"
                :hint="ScrollerKnobs.HIDE_DELAY_MS.hint"
            >
                <PageNumberField
                    :value="hideDelayMs"
                    :min="ScrollerKnobs.HIDE_DELAY_MS.min"
                    :max="ScrollerKnobs.HIDE_DELAY_MS.max"
                    :step="ScrollerKnobs.HIDE_DELAY_MS.step"
                    :ariaLabel="ScrollerKnobs.HIDE_DELAY_MS.label"
                    @input="(value: number) => (hideDelayMs = value)"
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

            <template #verticalStrip>
                <VerticalStripExample :labels="labels" :overlap-count="overlapCount" />
            </template>

            <template #bothWays>
                <BothWaysExample
                    :labels="labels"
                    :overflow-x="overflowX"
                    :overflow-y="overflowY"
                    :is-auto-hiding="isAutoHiding"
                    :hide-delay-ms="hideDelayMs"
                    :is-bar-overlaid="isBarOverlaid"
                />
            </template>

            <template #overlaidAutoHiding>
                <VerticalStripExample
                    :labels="labels"
                    :overlap-count="overlapCount"
                    :is-auto-hiding="true"
                    :hide-delay-ms="hideDelayMs"
                    :is-bar-overlaid="true"
                />
            </template>

            <template #shortTrack>
                <ShortTrackExample :labels="labels" :overlap-count="overlapCount" />
            </template>

            <template #arched>
                <ArchedExample :labels="labels" :overlap-count="overlapCount" />
            </template>
        </PageExamples>
    </div>
</template>
