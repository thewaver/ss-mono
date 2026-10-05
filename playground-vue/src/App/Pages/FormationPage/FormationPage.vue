<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    FORMATION_DEFAULTS,
    PlacementLayoutDefaults,
    PlacementLayouts,
    ProximityEffectDefaults,
    ProximityEffects,
} from "@thewaver/ss-components-vue";
import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components-vue";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import { ShapeConst } from "@thewaver/ss-utils";

import { FormationKnobs } from "../../Knobs/Formations.const";
import { PlacementLayoutKnobs } from "../../Knobs/PlacementLayouts.const";
import { ProximityEffectKnobs } from "../../Knobs/ProximityEffects.const";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExampleWrapper from "./DefaultExampleWrapper.vue";
import type { FormationExampleProps } from "./FormationPage.types";

const FIELD_WIDTH = 130;
const EXAMPLES_ROOT = "/src/App/Pages/FormationPage/Examples";

const NAMES = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];

const NO_DEFS: Record<string, number | boolean> = {};

const itemCount = shallowRef(FormationKnobs.STARTING_ITEM_COUNT);
const skippedCount = shallowRef(FormationKnobs.MIN_SKIPPED_COUNT);
const layoutKey = shallowRef<PlacementLayouts.SampleKey>(FormationKnobs.STARTING_LAYOUT_KEY);
const effectKey = shallowRef<WithNoSample<ProximityEffects.SampleKey>>(FormationKnobs.STARTING_EFFECT_KEY);
const shapeKind = shallowRef<ShapeConst.DefaultShape>(FormationKnobs.STARTING_SHAPE_KIND);
const isStackedInReverse = shallowRef(FormationKnobs.STARTING_IS_STACKED_IN_REVERSE);
const transitionDurationMs = shallowRef(FORMATION_DEFAULTS.transitionDurationMs);
const transitionDelayMs = shallowRef(FORMATION_DEFAULTS.transitionDelayMs);
const layoutDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});
const effectDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});

const family = computed(() => PlacementLayouts.SAMPLE_LAYOUTS[layoutKey.value].family);
const knobs = computed(() => PlacementLayoutKnobs.KNOBS_BY_FAMILY[family.value] as Record<string, Knob>);
const defaults = computed(() => PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[family.value] as Record<string, unknown>);
const defs = computed(() => layoutDefs.value[layoutKey.value] ?? NO_DEFS);

const layoutEntry = computed(() => ({ family: family.value, defs: defs.value }) as unknown as PlacementLayoutEntry);

const effectFamily = computed(() =>
    effectKey.value === NO_SAMPLE_KEY ? undefined : ProximityEffects.SAMPLE_EFFECTS[effectKey.value].family,
);

const effectKnobs = computed(
    () =>
        (effectFamily.value === undefined ? {} : ProximityEffectKnobs.KNOBS_BY_FAMILY[effectFamily.value]) as Record<
            string,
            Knob
        >,
);

const effectDefaults = computed(
    () =>
        (effectFamily.value === undefined
            ? {}
            : ProximityEffectDefaults.DEFAULTS_BY_FAMILY[effectFamily.value]) as Record<string, unknown>,
);

const pickedEffectDefs = computed(() => effectDefs.value[effectKey.value] ?? NO_DEFS);

const effectEntry = computed(() =>
    effectFamily.value === undefined
        ? undefined
        : ({ family: effectFamily.value, defs: pickedEffectDefs.value } as unknown as ProximityEffectEntry),
);

const items = computed(() => NAMES.slice(skippedCount.value, skippedCount.value + itemCount.value));

const commonProps = computed<FormationExampleProps>(() => ({
    items: items.value,
    isStackedInReverse: isStackedInReverse.value,
    layoutEntry: layoutEntry.value,
    effectEntry: effectEntry.value,
    shapeKind: shapeKind.value,
    transitionDurationMs: transitionDurationMs.value,
    transitionDelayMs: transitionDelayMs.value,
}));

const setLayoutDef = (key: string, value: number | boolean) => {
    layoutDefs.value = {
        ...layoutDefs.value,
        [layoutKey.value]: { ...layoutDefs.value[layoutKey.value], [key]: value },
    };
};

const setEffectDef = (key: string, value: number | boolean) => {
    effectDefs.value = {
        ...effectDefs.value,
        [effectKey.value]: { ...effectDefs.value[effectKey.value], [key]: value },
    };
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="layoutKey"
                label="Arrangement"
                hint="How the items are arranged: a ring, an arc, a row, a honeycomb, and so on. Choosing one brings its own knobs with it."
            >
                <PageSelectField
                    :value="layoutKey"
                    :values="PlacementLayouts.SAMPLE_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrangement"
                    @change="(value: PlacementLayouts.SampleKey) => (layoutKey = value)"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="defs" :width="FIELD_WIDTH" @input="setLayoutDef" />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="sample">
            <PageProp
                item-key="effectKey"
                label="Pointer effect"
                hint="What the items do as the pointer nears them. Choosing one brings its own knobs with it."
            >
                <PageSelectField
                    :value="effectKey"
                    :values="FormationKnobs.EFFECT_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Pointer effect"
                    @change="(value: WithNoSample<ProximityEffects.SampleKey>) => (effectKey = value)"
                />
            </PageProp>

            <PageKnobs
                :knobs="effectKnobs"
                :defaults="effectDefaults"
                :values="pickedEffectDefs"
                :width="FIELD_WIDTH"
                @input="setEffectDef"
            />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageProp item-key="itemCount" label="Items" hint="How many items the arrangement holds.">
                <PageNumberField
                    :value="itemCount"
                    :min="FormationKnobs.MIN_ITEM_COUNT"
                    :max="FormationKnobs.MAX_ITEM_COUNT"
                    :step="FormationKnobs.ITEM_COUNT_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Items"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="skippedCount"
                label="Skip from the start"
                hint="Leaves out that many items from the front of the list, so an item can be taken out from the start rather than the end."
            >
                <PageNumberField
                    :value="skippedCount"
                    :min="FormationKnobs.MIN_SKIPPED_COUNT"
                    :max="NAMES.length - FormationKnobs.MIN_ITEM_COUNT"
                    :step="FormationKnobs.ITEM_COUNT_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Skip from the start"
                    @input="(value: number) => (skippedCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="isStackedInReverse"
                label="Earlier items in front"
                hint="Puts the first item on top of the pile instead of the last, which shows where two items overlap."
            >
                <PageCheckField
                    :value="isStackedInReverse"
                    ariaLabel="Earlier items in front"
                    @change="(value: boolean) => (isStackedInReverse = value)"
                />
            </PageProp>

            <PageProp item-key="shapeKind" label="Item shape" hint="The contour each item is cut to.">
                <PageSelectField
                    :value="shapeKind"
                    :values="ShapeConst.DEFAULT_SHAPES"
                    :width="FIELD_WIDTH"
                    ariaLabel="Item shape"
                    @change="(value: ShapeConst.DefaultShape) => (shapeKind = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Glide (ms)"
                hint="How long an item takes to glide to its new place when the arrangement, the item count or a knob changes. At 0 it moves at once, and under reduced motion it always does."
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="FormationKnobs.MIN_DURATION_MS"
                    :max="FormationKnobs.MAX_DURATION_MS"
                    :step="FormationKnobs.DURATION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Glide duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDelayMs"
                label="Transition delay (ms)"
                hint="How much later each item sets off than the one before it, while gliding is on."
            >
                <PageNumberField
                    :value="transitionDelayMs"
                    :min="FormationKnobs.MIN_STAGGER_MS"
                    :max="FormationKnobs.MAX_STAGGER_MS"
                    :step="FormationKnobs.STAGGER_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition delay in milliseconds"
                    @input="(value: number) => (transitionDelayMs = value)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExampleWrapper v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
