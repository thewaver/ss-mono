<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { PAINTED_TEXT_DEFAULTS } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import CircleExample from "./Examples/Circle.vue";
import type { PaintedTextExampleProps, PaintedTextPathExampleWrapperProps } from "./PaintedTextPage.types";

const props = defineProps<PaintedTextPathExampleWrapperProps>();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const radius = shallowRef(PaintedTextKnobs.STARTING_CIRCLE_RADIUS);
const lapDurationMs = shallowRef(PAINTED_TEXT_DEFAULTS.lapDurationMs);
const isFittedToPath = shallowRef(PaintedTextKnobs.STARTING_IS_FITTED_TO_PATH);

const exampleProps = computed((): PaintedTextExampleProps => {
    const {
        "width": _width,
        "progress": _progress,
        "onUpdate:progress": _onProgress,
        "playback": _playback,
        "onUpdate:playback": _onPlayback,
        ...rest
    } = props;

    return rest;
});
</script>

<template>
    <PageMeasureBox :padding="MEASURE_BOX_PADDING">
        <CircleExample
            v-bind="exampleProps"
            v-model:progress="progress"
            v-model:playback="playback"
            :radius="radius"
            :lap-duration-ms="lapDurationMs"
            :is-fitted-to-path="isFittedToPath"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp
            item-key="radius"
            label="Radius (px)"
            hint="How far the circle the text runs round is from its center."
        >
            <PageNumberField
                :value="radius"
                :min="PaintedTextKnobs.MIN_CIRCLE_RADIUS"
                :max="PaintedTextKnobs.MAX_CIRCLE_RADIUS"
                :step="PaintedTextKnobs.CIRCLE_RADIUS_STEP"
                ariaLabel="Radius in pixels"
                @input="(value: number) => (radius = value)"
            />
        </PageProp>

        <PageProp
            item-key="lapDurationMs"
            label="Lap duration (ms)"
            hint="How long the text takes to slide once round the whole length of its path."
        >
            <PageNumberField
                :value="lapDurationMs"
                :min="PaintedTextKnobs.MIN_LAP_DURATION_MS"
                :max="PaintedTextKnobs.MAX_LAP_DURATION_MS"
                :step="PaintedTextKnobs.LAP_DURATION_STEP_MS"
                ariaLabel="Lap duration in milliseconds"
                @input="(value: number) => (lapDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="isFittedToPath"
            label="Fit to the circle"
            hint="Stretches or squeezes the spacing between the letters so the text goes round the circle exactly once, meeting its own start."
        >
            <PageCheckField
                :value="isFittedToPath"
                ariaLabel="Fit to the circle"
                @change="(value: boolean) => (isFittedToPath = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
