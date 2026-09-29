<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { type SVGDefsColors, SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGGradientKnobs } from "../../../Knobs/SVGGradients.const";
import { TrackedGradientKnobs } from "../../../Knobs/TrackedGradients.const";
import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.vue";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import { GROUPPED_TRACKED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsControls, SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradients.types";
import PageSVGGradientsProps from "../SVGGradientsProps.vue";
import ContinuityExample from "./Examples/Continuity.vue";
import DefaultExample from "./Examples/Default.vue";
import TrackedGradientOverlay from "./TrackedGradientOverlay.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SVGGradients/TrackedGradientsPage/Examples";

const TRACKED_GRADIENT_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_GRADIENTS);

const configKey = shallowRef<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
    SVGGradientKnobs.STARTING_TRACKED_GRADIENT_KEY,
);
const configDefsByKey = shallowRef<Record<string, Record<string, number | boolean>>>({});

const knobs = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedGradientKnobs.KNOBS_BY_FAMILY[configKey.value] as Record<string, Knob>),
);
const defaults = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[configKey.value] as Record<string, unknown>),
);
const configDefs = computed(() => configDefsByKey.value[configKey.value] ?? {});
const isOverlayShown = shallowRef(TrackedGradientKnobs.STARTING_IS_OVERLAY_SHOWN);
const paintKind = shallowRef<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
const blurWidth = shallowRef(SVGGradientKnobs.STARTING_BLUR_WIDTH);
const colors = shallowRef({ ...SVGDefsSamples.SAMPLE_COLORS });

const commonProps = computed<TrackedGradientExampleProps>(() => ({
    configDefs: configDefs.value,
    configKey: configKey.value,
    paintKind: paintKind.value,
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
        name: "Default",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "continuity",
        name: "Continuity",
        readout: () => "four boxes, each reading the pointer against its own — a pool spans them, a hand does not",
        path: `${EXAMPLES_ROOT}/Continuity.vue`,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="configKey"
                label="Gradient"
                hint="Which pointer-following gradient is shown. Choosing one brings its own knobs with it."
            >
                <PageGroupedSelectField
                    :value="configKey"
                    :groups="TRACKED_GRADIENT_GROUPS"
                    ariaLabel="Gradient"
                    @change="(config: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>) => (configKey = config)"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="configDefs" @input="setConfigDef" />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageSVGGradientsProps :controls="controls" />

            <PageProp
                item-key="isOverlayShown"
                label="Screen overlay"
                hint="Draws the gradient on a layer over the whole window, so it follows the pointer everywhere. Clicks pass through it, and a button in the top-right corner turns it off. Its sizes are a quarter of what the knobs say, since the box it fills is the whole window."
            >
                <PageCheckField
                    :value="isOverlayShown"
                    ariaLabel="Screen overlay"
                    @change="(value: boolean) => (isOverlayShown = value)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>

        <template #continuity>
            <ContinuityExample v-bind="commonProps" />
        </template>
    </PageExamples>

    <TrackedGradientOverlay
        :is-shown="isOverlayShown"
        :config-defs="configDefs"
        :config-key="configKey"
        :colors="colors"
        :blur-width="blurWidth"
        @close="isOverlayShown = false"
    />
</template>
