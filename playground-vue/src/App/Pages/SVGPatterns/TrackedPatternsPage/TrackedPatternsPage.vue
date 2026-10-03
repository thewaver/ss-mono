<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { type SVGDefsColors, SVGDefsSamples, TrackedPatternDefaults } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
import { TrackedPatternKnobs } from "../../../Knobs/TrackedPatterns.const";
import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.vue";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import { GROUPPED_TRACKED_PATTERNS } from "../SVGPatterns.const";
import type { SVGPatternsControls, TrackedPatternExampleProps } from "../SVGPatterns.types";
import PageSVGPatternsProps from "../SVGPatternsProps.vue";
import DefaultExample from "./Examples/Default.vue";

const TRACKED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TrackedPatternsPage/Examples/Default.vue";

const configKey = shallowRef<WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>>(
    SVGPatternKnobs.STARTING_TRACKED_PATTERN_KEY,
);
const configDefsByKey = shallowRef<Record<string, Record<string, number | boolean>>>({});

const knobs = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedPatternKnobs.KNOBS_BY_FAMILY[configKey.value] as Record<string, Knob>),
);
const defaults = computed(() =>
    configKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedPatternDefaults.DEFAULTS_BY_FAMILY[configKey.value] as Record<string, unknown>),
);
const configDefs = computed(() => configDefsByKey.value[configKey.value] ?? {});
const cellSize = shallowRef(SVGPatternKnobs.STARTING_CELL_SIZE);
const blurWidth = shallowRef(SVGPatternKnobs.STARTING_BLUR_WIDTH);
const colors = shallowRef({ ...SVGDefsSamples.SAMPLE_COLORS });

const cellSize2d = computed(() => ({ width: cellSize.value, height: cellSize.value }));

const commonProps = computed<TrackedPatternExampleProps>(() => ({
    configKey: configKey.value,
    configDefs: configDefs.value,
    colors: colors.value,
    cellSize: cellSize2d.value,
    blurWidth: blurWidth.value,
}));

const controls = computed<SVGPatternsControls>(() => ({
    cellSize,
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
        readout: () =>
            "drag the corner to resize the box: drawn as one tile, the cell count follows the size; tiled, the copies appear and all of them react",
        path: DEFAULT_EXAMPLE_PATH,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="configKey"
                label="Pattern"
                hint="Which pointer-following pattern is shown. Choosing one brings its own knobs with it."
            >
                <PageGroupedSelectField
                    :value="configKey"
                    :groups="TRACKED_PATTERN_GROUPS"
                    ariaLabel="Pattern"
                    @change="(config: WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>) => (configKey = config)"
                />
            </PageProp>

            <PageKnobs :knobs="knobs" :defaults="defaults" :values="configDefs" @input="setConfigDef" />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageSVGPatternsProps :controls="controls" />
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
