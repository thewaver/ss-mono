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
import OrbitExample from "./Examples/Orbit.vue";
import type { RGBAnimationWrapperProps } from "./RGBAnimationPageVue.types";

const props = defineProps<RGBAnimationWrapperProps>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const radiusPercent = shallowRef(RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT);

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
            <OrbitExample
                v-bind="sharedProps"
                v-model:playback="playback"
                v-model:progress="progress"
                :radius-percent="radiusPercent"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="orbit"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="radiusPercent"
            controls="Sets the example's radius, read by its RGBAnimationProps.computeChannelAnimation"
            label="Radius (%)"
            hint="How far the channels circle from their resting place at the widest point of the pass, as a share of the picture's size."
        >
            <PageNumberField
                :value="radiusPercent"
                :min="RGBAnimationKnobs.MIN_ORBIT_RADIUS_PERCENT"
                :max="RGBAnimationKnobs.MAX_ORBIT_RADIUS_PERCENT"
                :step="RGBAnimationKnobs.ORBIT_RADIUS_STEP_PERCENT"
                :width="FIELD_WIDTH"
                ariaLabel="Position in the pass"
                @input="(value: number) => (radiusPercent = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
