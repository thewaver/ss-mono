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
import FocusPullExample from "./Examples/FocusPull.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const maxBlurPx = shallowRef(RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX);

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
            <FocusPullExample
                v-bind="sharedProps"
                v-model:playback="playback"
                v-model:progress="progress"
                :max-blur-px="maxBlurPx"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="focusPull"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="maxBlurPx"
            controls="Sets the example's blur, read by its RGBAnimationProps.computeChannelAnimation"
            label="Blur (px)"
            hint="How soft each channel goes at the worst of its turn out of focus."
        >
            <PageNumberField
                :value="maxBlurPx"
                :min="RGBAnimationKnobs.MIN_FOCUS_BLUR_PX"
                :max="RGBAnimationKnobs.MAX_FOCUS_BLUR_PX"
                :step="RGBAnimationKnobs.FOCUS_BLUR_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (maxBlurPx = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
