<script setup lang="ts">
import { type Component, computed, shallowRef, useModel } from "vue";

import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import { STRESS_ITEM_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import AnaglyphExample from "./Examples/Anaglyph.vue";
import EchoExample from "./Examples/Echo.vue";
import FocusPullExample from "./Examples/FocusPull.vue";
import GlitchExample from "./Examples/Glitch.vue";
import HueSwapExample from "./Examples/HueSwap.vue";
import OrbitExample from "./Examples/Orbit.vue";
import SwellExample from "./Examples/Swell.vue";
import TiltExample from "./Examples/Tilt.vue";
import TwistExample from "./Examples/Twist.vue";

const STRESS_EXAMPLES: { component: Component; props: Record<string, unknown> }[] = [
    { component: GlitchExample, props: { glitchOpts: RGBAnimationKnobs.STARTING_GLITCH_OPTS } },
    { component: SwellExample, props: { scalePercent: RGBAnimationKnobs.STARTING_SCALE_PERCENT } },
    { component: OrbitExample, props: { radiusPercent: RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT } },
    { component: FocusPullExample, props: { maxBlurPx: RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX } },
    { component: TwistExample, props: { maxDegrees: RGBAnimationKnobs.STARTING_TWIST_DEGREES } },
    { component: HueSwapExample, props: { turns: RGBAnimationKnobs.STARTING_HUE_TURNS } },
    { component: TiltExample, props: { maxDegrees: RGBAnimationKnobs.STARTING_TILT_DEGREES } },
    {
        component: AnaglyphExample,
        props: { separationPercent: RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT },
    },
    { component: EchoExample, props: { distancePercent: RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT } },
];

type Props = BaseRGBAnimationExampleProps & {
    "modalPlayback": boolean;
    "onUpdate:modalPlayback"?: (isPlaying: boolean) => void;
};

const props = defineProps<Props>();

const modalPlayback = useModel(props, "modalPlayback");
const progress = shallowRef(0);

const example = STRESS_EXAMPLES[Math.floor(Math.random() * STRESS_EXAMPLES.length)];

const sharedProps = computed(() => {
    const { "modalPlayback": _modalPlayback, "onUpdate:modalPlayback": _setModalPlayback, ...shared } = props;

    return { ...shared, ...example.props };
});
</script>

<template>
    <PageMeasureBox :width="STRESS_ITEM_WIDTH">
        <component
            :is="example.component"
            v-bind="sharedProps"
            v-model:playback="modalPlayback"
            v-model:progress="progress"
        />
    </PageMeasureBox>
</template>
