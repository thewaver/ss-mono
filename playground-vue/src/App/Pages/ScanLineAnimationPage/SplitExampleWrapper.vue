<script setup lang="ts">
import { reactive } from "vue";

import { ScanlineAnimationKeyframes } from "@thewaver/ss-components-vue";
import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    ScanlineHorizontalSplitOpts,
} from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

import { ScanlineAnimationKeyframeKnobs } from "../../Knobs/ScanlineAnimationKeyframes.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DirInput from "./DirInput.vue";
import SplitExample from "./Examples/Split.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SmoothnessInput from "./SmoothnessInput.vue";

const IMAGE_CONTAINER_SIZE = 360;

const props = defineProps<ScanlineAnimationExampleProps>();

const keyframeOpts = reactive<Record<string, number | boolean>>({});
const breakpointOpts = reactive<CellAnimationBreakpointOpts>({
    ...ScanlineAnimationKnobs.STARTING_SPLIT_BREAKPOINT_OPTS,
});
</script>

<template>
    <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
        <SplitExample
            v-bind="props"
            :keyframe-opts="keyframeOpts as ScanlineHorizontalSplitOpts"
            :breakpoint-opts="breakpointOpts"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageKnobs
            :knobs="ScanlineAnimationKeyframeKnobs.SPLIT_KNOBS"
            :defaults="ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SPLIT_OPTS"
            :values="keyframeOpts"
            @input="(key: string, value: number | boolean) => (keyframeOpts[key] = value)"
        />

        <SmoothnessInput
            :value="breakpointOpts.smoothness!"
            :setter="(value: number) => (breakpointOpts.smoothness = value)"
        />
        <DirInput
            :value="breakpointOpts.dir!"
            :setter="(value: CellAnimationBreakpointDirection) => (breakpointOpts.dir = value)"
        />
    </PageExampleKnobs>
</template>
