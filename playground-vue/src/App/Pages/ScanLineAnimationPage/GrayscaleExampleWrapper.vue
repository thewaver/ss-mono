<script setup lang="ts">
import { computed, reactive, shallowRef } from "vue";

import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    ScanlineHorizontalGrayscaleOpts,
} from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import DirInput from "./DirInput.vue";
import GrayscaleExample from "./Examples/Grayscale.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SmoothnessInput from "./SmoothnessInput.vue";

const props = defineProps<ScanlineAnimationExampleProps>();

const playback = shallowRef(true);
const progress = shallowRef(0);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});

const keyframeOpts: ScanlineHorizontalGrayscaleOpts = {};
const breakpointOpts = reactive<CellAnimationBreakpointOpts>({
    ...ScanlineAnimationKnobs.STARTING_GRAYSCALE_BREAKPOINT_OPTS,
});
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
            <GrayscaleExample
                v-bind="sharedProps"
                :playback="props.playback && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :keyframe-opts="keyframeOpts"
                :breakpoint-opts="breakpointOpts"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="scanlineGrayscale"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

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
