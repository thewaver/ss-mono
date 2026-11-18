<script setup lang="ts">
import { computed, reactive, shallowRef } from "vue";

import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import { usePagePlayback } from "../../PageComponents/PlaybackScrubber/PlaybackGroup.context";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import GlitchExample from "./Examples/Glitch.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

const props = defineProps<ScanlineAnimationExampleProps>();

const playback = usePagePlayback("scanlineGlitch");
const progress = shallowRef(0);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});

const keyframeOpts = reactive({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
            <GlitchExample
                v-bind="sharedProps"
                :playback="props.playback && playback"
                @update:playback="(next: boolean) => (playback = next)"
                v-model:progress="progress"
                :keyframe-opts="keyframeOpts"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="scanlineGlitch"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp item-key="count" v-bind="ScanlineAnimationKnobs.COUNT_TEXT">
            <PageNumberField
                :value="keyframeOpts.count"
                :min="ScanlineAnimationKnobs.MIN_GLITCH_COUNT"
                :max="ScanlineAnimationKnobs.MAX_GLITCH_COUNT"
                :step="ScanlineAnimationKnobs.GLITCH_COUNT_STEP"
                ariaLabel="Count"
                @input="(value: number) => (keyframeOpts.count = value)"
            />
        </PageProp>

        <PageProp item-key="maxShift" v-bind="ScanlineAnimationKnobs.MAX_SHIFT_TEXT">
            <PageNumberField
                :value="keyframeOpts.shiftPercent"
                :min="ScanlineAnimationKnobs.MIN_SHIFT_PERCENT"
                :max="ScanlineAnimationKnobs.MAX_SHIFT_PERCENT"
                :step="ScanlineAnimationKnobs.SHIFT_PERCENT_STEP"
                ariaLabel="Shift percent"
                @input="(value: number) => (keyframeOpts.shiftPercent = value)"
            />
        </PageProp>

        <PageProp item-key="chunkyness01" v-bind="ScanlineAnimationKnobs.CHUNKYNESS01_TEXT">
            <PageNumberField
                :value="keyframeOpts.chunkyness"
                :min="ScanlineAnimationKnobs.MIN_CHUNKYNESS"
                :max="ScanlineAnimationKnobs.MAX_CHUNKYNESS"
                :step="ScanlineAnimationKnobs.CHUNKYNESS_STEP"
                ariaLabel="Chunkyness"
                @input="(value: number) => (keyframeOpts.chunkyness = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
