<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    CorridorLayoutDefaults,
    CorridorLayoutUtils,
    CorridorLayouts,
    INFINITE_CORRIDOR_DEFAULTS,
} from "@thewaver/ss-components-vue";
import type { CorridorLayoutEntry } from "@thewaver/ss-components-vue";
import { CorridorLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/CorridorLayouts.const";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    LAYOUT_FIELD_WIDTH,
    toRoomName,
} from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import ClockExampleWrapper from "./ClockExampleWrapper.vue";
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageVue.types";
import ScrolledExampleWrapper from "./ScrolledExampleWrapper.vue";

const layoutKey = shallowRef<CorridorLayouts.SampleKey>(InfiniteCorridorKnobs.STARTING_LAYOUT);
const itemCount = shallowRef(InfiniteCorridorKnobs.STARTING_ITEM_COUNT);
const glideDurationMs = shallowRef(INFINITE_CORRIDOR_DEFAULTS.glideDurationMs);

const spinDegreesPerSecond = shallowRef(CorridorLayoutKnobs.STARTING_SPIN_DEGREES_PER_SECOND);
const layoutDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});

const family = computed(() => CorridorLayouts.SAMPLE_LAYOUTS[layoutKey.value].family);
const knobs = computed(() => CorridorLayoutKnobs.KNOBS_BY_FAMILY[family.value] as Record<string, Knob>);
const defaults = computed(() => CorridorLayoutDefaults.DEFAULTS_BY_FAMILY[family.value] as Record<string, unknown>);
const defs = computed(() => layoutDefs.value[layoutKey.value] ?? {});

const toLayout = (spinDegrees: number) =>
    CorridorLayoutUtils.toLayoutRule({
        family: family.value,
        defs: { spinDegrees, ...defs.value },
    } as unknown as CorridorLayoutEntry);

const items = computed(() => Array.from({ length: itemCount.value }, (_, index) => toRoomName(index)));

const commonProps = computed<InfiniteCorridorExampleProps>(() => ({
    items: items.value,
    glideDurationMs: glideDurationMs.value,
    spinDegreesPerSecond: family.value === "tube" ? spinDegreesPerSecond.value : 0,
    toLayout,
}));

const setLayoutDef = (key: string, value: number | boolean) => {
    layoutDefs.value = {
        ...layoutDefs.value,
        [layoutKey.value]: { ...layoutDefs.value[layoutKey.value], [key]: value },
    };
};

const examples: ExampleDefs[] = [
    {
        key: "scrolled",
        name: EXAMPLE_NAMES.scrolled,
        readout: () =>
            "scrolling the box walks the corridor one lap from top to bottom — Tab to a room out of view and the corridor brings it in, scrolling the box there",
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
    {
        key: "clock",
        name: EXAMPLE_NAMES.clock,
        readout: () =>
            "the progress is advanced on every frame, so the corridor walks by itself until paused — it starts paused when the visitor has asked for reduced motion",
        path: `${EXAMPLES_ROOT}/Clock.vue`,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="layout"
                controls="Picks the sample layout sent to InfiniteCorridorProps.layout"
                label="Layout"
                hint="Where the items stand: walls is one row on each wall, from flat against it to turned towards the viewer, and tube lines the inside of a ring of sides, every item upright towards the center. Choosing one brings its own knobs with it."
            >
                <PageSelectField
                    :value="layoutKey"
                    :values="CorridorLayouts.SAMPLE_KEYS"
                    :width="LAYOUT_FIELD_WIDTH"
                    ariaLabel="Layout"
                    @change="(value: CorridorLayouts.SampleKey) => (layoutKey = value)"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="defs" :width="FIELD_WIDTH" @input="setLayoutDef" />

            <PageProp
                v-if="family === 'tube'"
                item-key="spinDegreesPerSecond"
                controls="Sets how fast the example turns the tube layout sent to InfiniteCorridorProps.layout"
                label="Rotation speed (°/s)"
                hint="How fast the tube spins round its axis, whatever the corridor's position. The page turns the layout's spinDegrees on a clock; 0 stops it, and below 0 spins it the other way."
            >
                <PageNumberField
                    :value="spinDegreesPerSecond"
                    :min="CorridorLayoutKnobs.MIN_SPIN_DEGREES_PER_SECOND"
                    :max="CorridorLayoutKnobs.MAX_SPIN_DEGREES_PER_SECOND"
                    :step="CorridorLayoutKnobs.SPIN_STEP_DEGREES_PER_SECOND"
                    :width="FIELD_WIDTH"
                    ariaLabel="Rotation speed in degrees per second"
                    @input="(value: number) => (spinDegreesPerSecond = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageProp
                item-key="itemCount"
                controls="Sets the number of example rooms sent to InfiniteCorridorProps.items"
                label="Item count"
                hint="How many rooms line the corridor. Too few to fill it are repeated, and only the copy nearest the viewer can be reached."
            >
                <PageNumberField
                    :value="itemCount"
                    :min="InfiniteCorridorKnobs.MIN_ITEM_COUNT"
                    :max="InfiniteCorridorKnobs.MAX_ITEM_COUNT"
                    :step="InfiniteCorridorKnobs.ITEM_COUNT_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Item count"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="glideDurationMs"
                controls="Sets InfiniteCorridorProps.glideDurationMs"
                label="Glide (ms)"
                hint="How long the corridor takes to bring a room into view when it is tabbed to from out of view. It times nothing else, so it shows only on Tab."
            >
                <PageNumberField
                    :value="glideDurationMs"
                    :min="InfiniteCorridorKnobs.MIN_GLIDE_DURATION_MS"
                    :max="InfiniteCorridorKnobs.MAX_GLIDE_DURATION_MS"
                    :step="InfiniteCorridorKnobs.GLIDE_DURATION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Glide duration in milliseconds"
                    @input="(value: number) => (glideDurationMs = value)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples">
        <template #scrolled>
            <ScrolledExampleWrapper v-bind="commonProps" />
        </template>

        <template #clock>
            <ClockExampleWrapper
                v-bind="commonProps"
                :starting-lap-ms="InfiniteCorridorKnobs.STARTING_LAP_MS_BY_FAMILY[family]"
            />
        </template>
    </PageExamples>
</template>
