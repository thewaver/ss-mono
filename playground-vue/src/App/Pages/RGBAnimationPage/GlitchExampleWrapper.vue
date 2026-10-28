<script setup lang="ts">
import { computed, reactive, useModel } from "vue";

import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import GlitchExample from "./Examples/Glitch.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const glitchOpts = reactive({ ...RGBAnimationKnobs.STARTING_GLITCH_OPTS });

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
            <GlitchExample
                v-bind="sharedProps"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :glitch-opts="{ ...glitchOpts }"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="glitch"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="glitchCount"
            controls="Sets the example's glitch count, read by its RGBAnimationProps.computeChannelAnimation"
            label="Glitches per pass"
            hint="How many tears follow each other in the middle of a pass. Each one shifts every channel its own way."
        >
            <PageNumberField
                :value="glitchOpts.count"
                :min="RGBAnimationKnobs.MIN_GLITCH_COUNT"
                :max="RGBAnimationKnobs.MAX_GLITCH_COUNT"
                :step="RGBAnimationKnobs.GLITCH_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Glitches per pass"
                @input="(value: number) => (glitchOpts.count = value)"
            />
        </PageProp>

        <PageProp
            item-key="shiftPercent"
            controls="Sets the example's shift, read by its RGBAnimationProps.computeChannelAnimation"
            label="Shift (%)"
            hint="The furthest a channel moves in a tear, as a share of the picture's size."
        >
            <PageNumberField
                :value="glitchOpts.shiftPercent"
                :min="RGBAnimationKnobs.MIN_SHIFT_PERCENT"
                :max="RGBAnimationKnobs.MAX_SHIFT_PERCENT"
                :step="RGBAnimationKnobs.SHIFT_PERCENT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Shift in percent"
                @input="(value: number) => (glitchOpts.shiftPercent = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
