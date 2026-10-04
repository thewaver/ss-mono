<script setup lang="ts">
import { shallowRef } from "vue";

import {
    AUTOMATIC_TABS,
    HOVER_PILL_TABS,
    REACHABLE_TABS,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import AllDisabledExample from "./Examples/AllDisabled.vue";
import ClearableExample, { CLEARABLE_TRANSITION_DURATION_MS } from "./Examples/Clearable.vue";
import ColumnExample from "./Examples/Column.vue";
import HoneycombExample from "./Examples/Honeycomb.vue";
import LinkComponentExample from "./Examples/LinkComponent.vue";
import LinksExample from "./Examples/Links.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import RowExample from "./Examples/Row.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TabsPage/Examples";

const rowValue = shallowRef("Render");
const columnValue = shallowRef("Overview");
const linkValue = shallowRef("Docs");
const customLinkValue = shallowRef("Docs");
const autoValue = shallowRef("Render");
const reachableValue = shallowRef("Render");
const hoverPillValue = shallowRef("Render");
const rightToLeftValue = shallowRef("Render");
const disabledValue = shallowRef("Draft");
const clearableValue = shallowRef<string | undefined>("One");
const honeycombValue = shallowRef("Overview");

const examples: ExampleDefs[] = [
    {
        key: "row",
        span: 2,
        name: "A row of tabs",
        readout: () => `selected: ${rowValue.value}`,
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "column",
        span: 2,
        name: "A column of tabs",
        readout: () => `selected: ${columnValue.value}`,
        path: `${EXAMPLES_ROOT}/Column.vue`,
    },
    {
        key: "automatic",
        span: 2,
        name: "Arrows that select as they move",
        readout: () =>
            `selected: ${autoValue.value} — an arrow both moves the focus and takes the selection with it, which suits a panel that is already loaded`,
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "hoverPill",
        span: 2,
        name: "A pill that follows the pointer",
        readout: () =>
            `selected: ${hoverPillValue.value} — the underline stays on the selected tab while a second marker glides to whichever tab the pointer or the focus is on`,
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "reachable",
        span: 2,
        name: "A disabled tab the arrows still reach",
        readout: () =>
            `selected: ${reachableValue.value} — Metrics is disabled but stays in the arrow walk, so focus lands on it and a reader hears that it is unavailable; pressing it still selects nothing`,
        path: `${EXAMPLES_ROOT}/Row.vue`,
    },
    {
        key: "rightToLeft",
        span: 2,
        name: "Tabs in a right-to-left box",
        readout: () =>
            `selected: ${rightToLeftValue.value} — the box around the tabs sets dir="rtl", so they run from the right and the left arrow moves on to the next tab`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "honeycomb",
        span: 2,
        name: "A honeycomb of tabs",
        readout: () =>
            `selected: ${honeycombValue.value} — the same tab list, placed by a layout that has no angle in it at all`,
        path: `${EXAMPLES_ROOT}/Honeycomb.vue`,
    },
    {
        key: "links",
        name: "Tabs that are links",
        readout: () => `selected: ${linkValue.value} — every tab carries an href, so each one is an anchor`,
        path: `${EXAMPLES_ROOT}/Links.vue`,
    },
    {
        key: "linkComponent",
        name: "Links through a component",
        readout: () => `selected: ${customLinkValue.value} — the same tabs rendered by a consumer's own link component`,
        path: `${EXAMPLES_ROOT}/LinkComponent.vue`,
    },
    {
        key: "clearable",
        name: "A selection that can be cleared",
        readout: () =>
            `selected: ${clearableValue.value ?? "nothing"} — the floater plays itself out over ${CLEARABLE_TRANSITION_DURATION_MS}ms when the selection goes, and plays itself back in when one returns`,
        path: `${EXAMPLES_ROOT}/Clearable.vue`,
    },
    {
        key: "disabled",
        name: "Every tab disabled",
        readout: () => `selected: ${disabledValue.value} — nothing can move it, so no tab holds the tab stop`,
        path: `${EXAMPLES_ROOT}/AllDisabled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #row>
            <RowExample :selected-value="rowValue" @selection-change="(value: string) => (rowValue = value)" />
        </template>

        <template #column>
            <ColumnExample :selected-value="columnValue" @selection-change="(value: string) => (columnValue = value)" />
        </template>

        <template #automatic>
            <RowExample
                :selected-value="autoValue"
                :tabs="AUTOMATIC_TABS"
                id-prefix="automatic"
                has-auto-activation
                @selection-change="(value: string) => (autoValue = value)"
            />
        </template>

        <template #hoverPill>
            <RowExample
                :selected-value="hoverPillValue"
                :tabs="HOVER_PILL_TABS"
                id-prefix="hoverPill"
                has-hover-pill
                @selection-change="(value: string) => (hoverPillValue = value)"
            />
        </template>

        <template #reachable>
            <RowExample
                :selected-value="reachableValue"
                :tabs="REACHABLE_TABS"
                id-prefix="reachable"
                @selection-change="(value: string) => (reachableValue = value)"
            />
        </template>

        <template #rightToLeft>
            <RightToLeftExample
                :selected-value="rightToLeftValue"
                @selection-change="(value: string) => (rightToLeftValue = value)"
            />
        </template>

        <template #honeycomb>
            <HoneycombExample
                :selected-value="honeycombValue"
                @selection-change="(value: string) => (honeycombValue = value)"
            />
        </template>

        <template #links>
            <LinksExample :selected-value="linkValue" @selection-change="(value: string) => (linkValue = value)" />
        </template>

        <template #linkComponent>
            <LinkComponentExample
                :selected-value="customLinkValue"
                @selection-change="(value: string) => (customLinkValue = value)"
            />
        </template>

        <template #clearable>
            <ClearableExample
                :selected-value="clearableValue"
                @selection-change="(value: string) => (clearableValue = value)"
                @clear="clearableValue = undefined"
            />
        </template>

        <template #disabled>
            <AllDisabledExample
                :selected-value="disabledValue"
                @selection-change="(value: string) => (disabledValue = value)"
            />
        </template>
    </PageExamples>
</template>
