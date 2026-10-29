<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import TiltExample from "./Examples/Tilt.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const maxDegrees = shallowRef(RGBAnimationKnobs.STARTING_TILT_DEGREES);

const sharedProps = computed(() => {
    const {
        "playback": _playback,
        "onUpdate:playback": _setPlayback,
        "progress": _progress,
        "onUpdate:progress": _setProgress,
        "boxWidth": _boxWidth,
        "isPagePlaying": _isPagePlaying,
        ...shared
    } = props;

    return shared;
});
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="boxWidth">
            <TiltExample
                v-bind="sharedProps"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :max-degrees="maxDegrees"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="tilt"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="maxDegrees"
            controls="Sets the example's angle, read by its RGBAnimationProps.computeSliceAnimation"
            label="Angle (°)"
            hint="How far red and blue swing in depth, in opposite directions. Green stays put."
        >
            <PageNumberField
                :value="maxDegrees"
                :min="RGBAnimationKnobs.MIN_TILT_DEGREES"
                :max="RGBAnimationKnobs.MAX_TILT_DEGREES"
                :step="RGBAnimationKnobs.TILT_STEP_DEGREES"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (maxDegrees = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
