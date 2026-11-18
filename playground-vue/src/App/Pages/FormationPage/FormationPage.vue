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
import { FormationKnobs } from "@thewaver/ss-playground/App/Knobs/Formations.const";
import { PlacementLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/PlacementLayouts.const";
import { ProximityEffectKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityEffects.const";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    NAMES,
    NO_DEFS,
} from "@thewaver/ss-playground/App/Pages/FormationPage/FormationPage.const";
import { ShapeConst } from "@thewaver/ss-utils";

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
import type { FormationExampleProps } from "./FormationPageVue.types";

const itemCount = shallowRef(FormationKnobs.STARTING_ITEM_COUNT);
const skippedCount = shallowRef(FormationKnobs.MIN_SKIPPED_COUNT);
const layoutKey = shallowRef<PlacementLayouts.SampleKey>(FormationKnobs.STARTING_LAYOUT_KEY);
const effectKey = shallowRef<WithNoSample<ProximityEffects.SampleKey>>(FormationKnobs.STARTING_EFFECT_KEY);
const shapeKind = shallowRef<ShapeConst.DefaultShape>(FormationKnobs.STARTING_SHAPE_KIND);
const isStackedInReverse = shallowRef(FormationKnobs.STARTING_IS_STACKED_IN_REVERSE);
const transitionDurationMs = shallowRef(FORMATION_DEFAULTS.transitionDurationMs);
const transitionDelayMs = shallowRef(FORMATION_DEFAULTS.transitionDelayMs);
const layoutDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});
const widths = shallowRef<Partial<Record<PlacementLayouts.SampleKey, number>>>({});
const effectDefs = shallowRef<Record<string, Record<string, number | boolean>>>({});

const family = computed(() => PlacementLayouts.SAMPLE_LAYOUTS[layoutKey.value].family);
const knobs = computed(() => PlacementLayoutKnobs.KNOBS_BY_FAMILY[family.value] as Record<string, Knob>);
const defaults = computed(() => PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[family.value] as Record<string, unknown>);
const defs = computed(() => layoutDefs.value[layoutKey.value] ?? NO_DEFS);
const width = computed(() => widths.value[layoutKey.value] ?? FormationKnobs.STARTING_WIDTHS[layoutKey.value]);

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
    width: width.value,
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
        name: EXAMPLE_NAMES.default,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp item-key="layoutKey" v-bind="FormationKnobs.LAYOUT_KEY_TEXT">
                <PageSelectField
                    :value="layoutKey"
                    :values="PlacementLayouts.SAMPLE_KEYS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrangement"
                    @change="(value: PlacementLayouts.SampleKey) => (layoutKey = value)"
                />
            </PageProp>

            <PageProp item-key="width" v-bind="FormationKnobs.WIDTH_TEXT">
                <PageNumberField
                    :key="layoutKey"
                    :value="width"
                    :min="FormationKnobs.MIN_WIDTH"
                    :max="FormationKnobs.MAX_WIDTH"
                    :step="FormationKnobs.WIDTH_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Width in pixels"
                    @input="(value: number) => (widths = { ...widths, [layoutKey]: value })"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="defs" :width="FIELD_WIDTH" @input="setLayoutDef" />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="sample">
            <PageProp item-key="effectKey" v-bind="FormationKnobs.EFFECT_KEY_TEXT">
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
            <PageProp item-key="itemCount" v-bind="FormationKnobs.ITEM_COUNT_TEXT">
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

            <PageProp item-key="skippedCount" v-bind="FormationKnobs.SKIPPED_COUNT_TEXT">
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

            <PageProp item-key="isStackedInReverse" v-bind="FormationKnobs.IS_STACKED_IN_REVERSE_TEXT">
                <PageCheckField
                    :value="isStackedInReverse"
                    ariaLabel="Earlier items in front"
                    @change="(value: boolean) => (isStackedInReverse = value)"
                />
            </PageProp>

            <PageProp item-key="shapeKind" v-bind="FormationKnobs.SHAPE_KIND_TEXT">
                <PageSelectField
                    :value="shapeKind"
                    :values="ShapeConst.DEFAULT_SHAPES"
                    :width="FIELD_WIDTH"
                    ariaLabel="Item shape"
                    @change="(value: ShapeConst.DefaultShape) => (shapeKind = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="FormationKnobs.TRANSITION_DURATION_MS_TEXT">
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

            <PageProp item-key="transitionDelayMs" v-bind="FormationKnobs.TRANSITION_DELAY_MS_TEXT">
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
