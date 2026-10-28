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
import HueSwapExample from "./Examples/HueSwap.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const turns = shallowRef(RGBAnimationKnobs.STARTING_HUE_TURNS);

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
            <HueSwapExample
                v-bind="sharedProps"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :turns="turns"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="hueSwap"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="turns"
            controls="Sets the example's turns, read by its RGBAnimationProps.computeChannelAnimation"
            label="Turns"
            hint="How many times the two turning channels go round the color wheel, in opposite directions, over one pass. The third stays put, a different one each pass."
        >
            <PageNumberField
                :value="turns"
                :min="RGBAnimationKnobs.MIN_HUE_TURNS"
                :max="RGBAnimationKnobs.MAX_HUE_TURNS"
                :step="RGBAnimationKnobs.HUE_TURNS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (turns = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
