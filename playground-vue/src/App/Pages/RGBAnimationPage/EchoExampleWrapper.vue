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
import EchoExample from "./Examples/Echo.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const distancePercent = shallowRef(RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT);

const sharedProps = computed(() => {
    const {
        "playback": _playback,
        "onUpdate:playback": _setPlayback,
        "progress": _progress,
        "onUpdate:progress": _setProgress,
        "boxWidth": _boxWidth,
        ...shared
    } = props;

    return shared;
});
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="boxWidth">
            <EchoExample
                v-bind="sharedProps"
                v-model:playback="playback"
                v-model:progress="progress"
                :distance-percent="distancePercent"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="echo"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="distancePercent"
            controls="Sets the example's distance, read by its RGBAnimationProps.computeRootAnimation and computeChannelAnimation"
            label="Distance (%)"
            hint="How far the picture drifts along its figure-eight, as a share of its size. Green and blue follow a little later than red."
        >
            <PageNumberField
                :value="distancePercent"
                :min="RGBAnimationKnobs.MIN_ECHO_DISTANCE_PERCENT"
                :max="RGBAnimationKnobs.MAX_ECHO_DISTANCE_PERCENT"
                :step="RGBAnimationKnobs.ECHO_DISTANCE_STEP_PERCENT"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (distancePercent = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
