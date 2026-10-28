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
import SwellExample from "./Examples/Swell.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const scalePercent = shallowRef(RGBAnimationKnobs.STARTING_SCALE_PERCENT);

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
            <SwellExample
                v-bind="sharedProps"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :scale-percent="scalePercent"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="swell"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="scalePercent"
            controls="Sets the example's scale, read by its RGBAnimationProps.computeChannelAnimation"
            label="Scale (%)"
            hint="How far red grows and blue shrinks at the top of the swell. Green stays put."
        >
            <PageNumberField
                :value="scalePercent"
                :min="RGBAnimationKnobs.MIN_SCALE_PERCENT"
                :max="RGBAnimationKnobs.MAX_SCALE_PERCENT"
                :step="RGBAnimationKnobs.SCALE_PERCENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Scale in percent"
                @input="(value: number) => (scalePercent = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
