<script setup lang="ts">
import { computed, reactive, shallowRef } from "vue";

import { ScanlineAnimationKeyframes } from "@thewaver/ss-components-vue";
import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    _ScanlineHorizontalRollOpts,
} from "@thewaver/ss-components-vue";
import { ScanlineAnimationKeyframeKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimationKeyframes.const";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import DirInput from "./DirInput.vue";
import RollExample from "./Examples/_Roll.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SmoothnessInput from "./SmoothnessInput.vue";

const props = defineProps<ScanlineAnimationExampleProps>();

const playback = shallowRef(true);
const progress = shallowRef(0);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});

const keyframeOpts = reactive<Record<string, number | boolean>>({});
const breakpointOpts = reactive<CellAnimationBreakpointOpts>({
    ...ScanlineAnimationKnobs.STARTING_ROLL_BREAKPOINT_OPTS,
});
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
            <RollExample
                v-bind="sharedProps"
                v-model:playback="playback"
                v-model:progress="progress"
                :keyframe-opts="keyframeOpts as _ScanlineHorizontalRollOpts"
                :breakpoint-opts="breakpointOpts"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="scanlineRoll"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageKnobs
            :knobs="ScanlineAnimationKeyframeKnobs.ROLL_KNOBS"
            :defaults="ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_ROLL_OPTS"
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
