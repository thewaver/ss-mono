<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { type SVGDefsColors, SVGDefsSamples, TimedGradientDefaults } from "@thewaver/ss-components-vue";
import { SVGGradientKnobs } from "@thewaver/ss-playground/App/Knobs/SVGGradients.const";
import { TimedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TimedGradients.const";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import {
    EXAMPLE_NAMES,
    TIMED_GRADIENT_GROUPS,
} from "@thewaver/ss-playground/App/Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageSVGGradientsProps from "../SVGGradientsProps.vue";
import type { SVGGradientsControls, SVGGradientsPaintKind, TimedGradientExampleProps } from "../SVGGradientsVue.types";
import DefaultExample from "./Examples/Default.vue";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TimedGradientsPage/Examples/Default.vue";

const configKey = shallowRef<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
    SVGGradientKnobs.STARTING_TIMED_GRADIENT_KEY,
);
const configDefsByKey = shallowRef<Record<string, Record<string, number | boolean>>>({});

const knobs = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TimedGradientKnobs.KNOBS_BY_FAMILY[configKey.value] as Record<string, Knob>),
);
const defaults = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[configKey.value] as Record<string, unknown>),
);
const configDefs = computed(() => configDefsByKey.value[configKey.value] ?? {});
const iterationConfigKey = shallowRef<SVGDefsSamples.Iteration.SampleKey>(SVGGradientKnobs.STARTING_ITERATION_KEY);
const animationDurationMs = shallowRef(SVGGradientKnobs.STARTING_DURATION_MS);
const paintKind = shallowRef<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
const blurWidth = shallowRef(SVGGradientKnobs.STARTING_BLUR_WIDTH);
const colors = shallowRef({ ...SVGDefsSamples.SAMPLE_COLORS });

const commonProps = computed<TimedGradientExampleProps>(() => ({
    configDefs: configDefs.value,
    configKey: configKey.value,
    paintKind: paintKind.value,
    iterationConfigKey: iterationConfigKey.value,
    animationDurationMs: animationDurationMs.value,
    colors: colors.value,
    blurWidth: blurWidth.value,
}));

const controls = computed<SVGGradientsControls>(() => ({
    paintKind,
    blurWidth,
    colors: colors.value,
    setColor: (key: keyof SVGDefsColors, value: string) => {
        colors.value = { ...colors.value, [key]: value };
    },
}));

const setConfigDef = (key: string, value: number | boolean) => {
    configDefsByKey.value = {
        ...configDefsByKey.value,
        [configKey.value]: { ...configDefsByKey.value[configKey.value], [key]: value },
    };
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        path: DEFAULT_EXAMPLE_PATH,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="configKey"
                controls="Picks the sample gradient the example sends to ShapeProps.computeFillDefs or ShapeProps.computeStrokeDefs"
                label="Gradient"
                hint="Which animated gradient is shown. Choosing one brings its own knobs with it."
            >
                <PageGroupedSelectField
                    :value="configKey"
                    :groups="TIMED_GRADIENT_GROUPS"
                    ariaLabel="Gradient"
                    @change="(config: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>) => (configKey = config)"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="configDefs" @input="setConfigDef" />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageSVGGradientsProps :controls="controls" />

            <PageProp
                item-key="animationDurationMs"
                controls="Sets SVGAnimationDefs.animationDurationMs"
                label="Animation duration (ms)"
                hint="How long one pass of the gradient's animation takes."
            >
                <PageNumberField
                    :value="animationDurationMs"
                    :min="SVGGradientKnobs.MIN_DURATION_MS"
                    :max="SVGGradientKnobs.MAX_DURATION_MS"
                    :step="SVGGradientKnobs.DURATION_STEP_MS"
                    ariaLabel="Animation duration"
                    @input="(value: number) => (animationDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="iterationConfigKey"
                controls="Picks the sample iteration that fills SVGAnimationDefs.animationIterationPatterns"
                label="Iteration Pattern"
                hint="How the animation repeats: once, endlessly, or back and forth."
            >
                <PageSelectField
                    :value="iterationConfigKey"
                    :values="SVGDefsSamples.Iteration.SAMPLE_KEYS"
                    ariaLabel="Iteration pattern"
                    @change="(config: SVGDefsSamples.Iteration.SampleKey) => (iterationConfigKey = config)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
