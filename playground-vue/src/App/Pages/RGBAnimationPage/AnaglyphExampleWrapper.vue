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
import AnaglyphExample from "./Examples/Anaglyph.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const separationPercent = shallowRef(RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT);

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
            <AnaglyphExample
                v-bind="sharedProps"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :separation-percent="separationPercent"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="anaglyph"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="separationPercent"
            controls="Sets the example's separation, read by its RGBAnimationProps.computeChannelAnimation"
            label="Separation (%)"
            hint="How far red moves left and blue moves right at the middle of the pass, as a share of the picture's width. Green stays put."
        >
            <PageNumberField
                :value="separationPercent"
                :min="RGBAnimationKnobs.MIN_ANAGLYPH_SEPARATION_PERCENT"
                :max="RGBAnimationKnobs.MAX_ANAGLYPH_SEPARATION_PERCENT"
                :step="RGBAnimationKnobs.ANAGLYPH_SEPARATION_STEP_PERCENT"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (separationPercent = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
