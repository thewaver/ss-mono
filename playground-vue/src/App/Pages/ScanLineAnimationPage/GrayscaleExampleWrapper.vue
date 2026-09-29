<script setup lang="ts">
import { reactive } from "vue";

import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    ScanlineHorizontalGrayscaleOpts,
} from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DirInput from "./DirInput.vue";
import GrayscaleExample from "./Examples/Grayscale.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SmoothnessInput from "./SmoothnessInput.vue";

const IMAGE_CONTAINER_SIZE = 360;

const props = defineProps<ScanlineAnimationExampleProps>();

const keyframeOpts: ScanlineHorizontalGrayscaleOpts = {};
const breakpointOpts = reactive<CellAnimationBreakpointOpts>({
    ...ScanlineAnimationKnobs.STARTING_GRAYSCALE_BREAKPOINT_OPTS,
});
</script>

<template>
    <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
        <GrayscaleExample v-bind="props" :keyframe-opts="keyframeOpts" :breakpoint-opts="breakpointOpts" />
    </PageMeasureBox>

    <PageExampleKnobs>
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
