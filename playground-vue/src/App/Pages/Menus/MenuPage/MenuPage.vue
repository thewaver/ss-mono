<script setup lang="ts">
import { shallowRef } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import CascaderExample from "./Examples/Cascader.vue";
import ContextAreaExample from "./Examples/ContextArea.vue";
import ContextRightToLeftExample from "./Examples/ContextRightToLeft.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import DrivenExample from "./Examples/Driven.vue";
import GlideExample from "./Examples/Glide.vue";
import PlacedAboveExample from "./Examples/PlacedAbove.vue";
import ReachableExample from "./Examples/Reachable.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import RightToLeftPlacedExample from "./Examples/RightToLeftPlaced.vue";
import SectionsExample from "./Examples/Sections.vue";
import StatefulExample from "./Examples/Stateful.vue";
import SubmenusExample from "./Examples/Submenus.vue";
import {
    ACTIONS_WITH_DISABLED,
    ACTIONS_WITH_REACHABLE,
    LAYERS,
    NOTHING_RUN,
    VIEW_DEFAULTS,
    ZOOM_ACTIONS,
    ZOOM_RESET_PERCENT,
    ZOOM_STEPS,
    ZOOM_STEP_PERCENT,
} from "./MenuPageVue.const";
import type { Action } from "./MenuPageVue.types";

const lastAction = shallowRef(NOTHING_RUN);
const lastDisabledAction = shallowRef(NOTHING_RUN);
const lastReachableAction = shallowRef(NOTHING_RUN);
const lastNestedAction = shallowRef(NOTHING_RUN);
const lastRightToLeftAction = shallowRef(NOTHING_RUN);
const lastPlacedRightToLeftAction = shallowRef(NOTHING_RUN);
const lastContextRightToLeftAction = shallowRef(NOTHING_RUN);
const lastFlippedAction = shallowRef(NOTHING_RUN);
const lastLayerAction = shallowRef(NOTHING_RUN);
const lastDrivenAction = shallowRef(NOTHING_RUN);
const lastContextAction = shallowRef(NOTHING_RUN);
const lastGlideAction = shallowRef(NOTHING_RUN);

const zoomPercent = shallowRef(ZOOM_RESET_PERCENT);

const cascaderPath = shallowRef<string[]>([]);

const applyZoom = (action: Action) => {
    const step = ZOOM_STEPS[action.name];

    zoomPercent.value = step === undefined ? ZOOM_RESET_PERCENT : Math.max(zoomPercent.value + step, ZOOM_STEP_PERCENT);
};

const drivenVisibility = shallowRef(false);
const view = shallowRef(VIEW_DEFAULTS);
const lastViewAction = shallowRef(NOTHING_RUN);
const sections = shallowRef(VIEW_DEFAULTS);
const lastSectionsAction = shallowRef(NOTHING_RUN);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () => `${lastAction.value} — activating an item closes the menu`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "glide",
        name: EXAMPLE_NAMES.glide,
        readout: () =>
            `${lastGlideAction.value} — the items paint no highlight of their own; one marker glides to whichever item the pointer or the arrows are on`,
        path: `${EXAMPLES_ROOT}/Glide.vue`,
    },
    {
        key: "driven",
        name: EXAMPLE_NAMES.driven,
        readout: () =>
            `${lastDrivenAction.value} — the menu is ${drivenVisibility.value ? "open" : "closed"}, and it is anchored to the toggle rather than to its own trigger`,
        path: `${EXAMPLES_ROOT}/Driven.vue`,
    },
    {
        key: "context",
        name: EXAMPLE_NAMES.context,
        readout: () =>
            `${lastContextAction.value} — the menu opens where the pointer was, and there is no trigger button anywhere`,
        path: `${EXAMPLES_ROOT}/ContextArea.vue`,
    },
    {
        key: "contextRightToLeft",
        name: EXAMPLE_NAMES.contextRightToLeft,
        readout: () =>
            `${lastContextRightToLeftAction.value} — the box around the region sets dir="rtl", so the menu spreads to the left of the pointer and its submenus open on the left`,
        path: `${EXAMPLES_ROOT}/ContextRightToLeft.vue`,
    },
    {
        key: "staysOpen",
        name: EXAMPLE_NAMES.staysOpen,
        readout: () =>
            `zoom: ${zoomPercent.value}% — Zoom in and Zoom out leave the menu open so they can be pressed again, and Reset zoom closes it`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "disabledItems",
        name: EXAMPLE_NAMES.disabledItems,
        readout: () => `${lastDisabledAction.value} — arrows skip Paste and Duplicate`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "disabledItemsReachable",
        name: EXAMPLE_NAMES.disabledItemsReachable,
        readout: () => `${lastReachableAction.value} — arrows stop on Paste, hover explains why`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "submenus",
        name: EXAMPLE_NAMES.submenus,
        readout: () => `${lastNestedAction.value} — ArrowRight steps in, ArrowLeft steps back out`,
        path: `${EXAMPLES_ROOT}/Submenus.vue`,
    },
    {
        key: "cascader",
        name: EXAMPLE_NAMES.cascader,
        readout: () =>
            `path: [${cascaderPath.value.join(", ")}] — the trigger shows the path picked so far, and only a leaf writes it; a branch just opens the next level`,
        path: `${EXAMPLES_ROOT}/Cascader.vue`,
    },
    {
        key: "rightToLeft",
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `${lastRightToLeftAction.value} — the box around the trigger sets dir="rtl", so a submenu opens on the left, ArrowLeft steps in and ArrowRight steps back out`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "rightToLeftPlaced",
        name: EXAMPLE_NAMES.rightToLeftPlaced,
        readout: () =>
            `${lastPlacedRightToLeftAction.value} — the box around the trigger sets dir="rtl", but the menu names the right as its submenu side, so its submenus open on the right and ArrowRight opens them`,
        path: `${EXAMPLES_ROOT}/RightToLeftPlaced.vue`,
    },
    {
        key: "placedAbove",
        name: EXAMPLE_NAMES.placedAbove,
        readout: () => `${lastFlippedAction.value} — the surface flips its own transform`,
        path: `${EXAMPLES_ROOT}/PlacedAbove.vue`,
    },
    {
        key: "scrollingList",
        name: EXAMPLE_NAMES.scrollingList,
        readout: () => `${lastLayerAction.value} — Home and End reach both ends`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "stateful",
        name: EXAMPLE_NAMES.stateful,
        readout: () => `${lastViewAction.value} — ticked: [${view.value.map((action) => action.name).join(", ")}]`,
        path: `${EXAMPLES_ROOT}/Stateful.vue`,
    },
    {
        key: "sections",
        name: EXAMPLE_NAMES.sections,
        readout: () =>
            `${lastSectionsAction.value} — ticked: [${sections.value
                .map((action) => action.name)
                .join(
                    ", ",
                )}]; each group is named, the arrows walk straight through the headings, and the radio choice stays inside its own group`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () => "the trigger neither opens nor takes focus",
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: EXAMPLE_NAMES.reachable,
        readout: () => "focusable so the tooltip can be read, but the menu must not open",
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample @activate="(action: Action) => (lastAction = action.name)" />
        </template>

        <template #glide>
            <GlideExample @activate="(action: Action) => (lastGlideAction = action.name)" />
        </template>

        <template #driven>
            <DrivenExample
                v-model:visibility="drivenVisibility"
                @activate="(action: Action) => (lastDrivenAction = action.name)"
            />
        </template>

        <template #context>
            <ContextAreaExample @activate="(action: Action) => (lastContextAction = action.name)" />
        </template>

        <template #contextRightToLeft>
            <ContextRightToLeftExample @activate="(action: Action) => (lastContextRightToLeftAction = action.name)" />
        </template>

        <template #staysOpen>
            <DefaultExample :items="ZOOM_ACTIONS" caption="Zoom" @activate="applyZoom" />
        </template>

        <template #disabledItems>
            <DefaultExample
                :items="ACTIONS_WITH_DISABLED"
                @activate="(action: Action) => (lastDisabledAction = action.name)"
            />
        </template>

        <template #disabledItemsReachable>
            <DefaultExample
                :items="ACTIONS_WITH_REACHABLE"
                @activate="(action: Action) => (lastReachableAction = action.name)"
            />
        </template>

        <template #submenus>
            <SubmenusExample @activate="(action: Action) => (lastNestedAction = action.name)" />
        </template>

        <template #cascader>
            <CascaderExample v-model:path="cascaderPath" />
        </template>

        <template #rightToLeft>
            <RightToLeftExample @activate="(action: Action) => (lastRightToLeftAction = action.name)" />
        </template>

        <template #rightToLeftPlaced>
            <RightToLeftPlacedExample @activate="(action: Action) => (lastPlacedRightToLeftAction = action.name)" />
        </template>

        <template #placedAbove>
            <PlacedAboveExample @activate="(action: Action) => (lastFlippedAction = action.name)" />
        </template>

        <template #scrollingList>
            <DefaultExample
                :items="LAYERS"
                caption="Layers"
                @activate="(action: Action) => (lastLayerAction = action.name)"
            />
        </template>

        <template #stateful>
            <StatefulExample
                v-model:checked="view"
                @activate="(action: Action) => (lastViewAction = `ran ${action.name}`)"
            />
        </template>

        <template #sections>
            <SectionsExample
                v-model:checked="sections"
                @activate="(action: Action) => (lastSectionsAction = `ran ${action.name}`)"
            />
        </template>

        <template #disabled>
            <DisabledExample />
        </template>

        <template #reachable>
            <ReachableExample />
        </template>
    </PageExamples>
</template>
