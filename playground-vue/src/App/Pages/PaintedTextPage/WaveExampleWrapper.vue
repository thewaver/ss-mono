<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { PAINTED_TEXT_DEFAULTS } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import WaveExample from "./Examples/Wave.vue";
import type { PaintedTextExampleProps, PaintedTextPathExampleWrapperProps } from "./PaintedTextPage.types";

const props = defineProps<PaintedTextPathExampleWrapperProps>();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const lapDurationMs = shallowRef(PAINTED_TEXT_DEFAULTS.lapDurationMs);

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
    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <WaveExample
            v-bind="exampleProps"
            v-model:progress="progress"
            v-model:playback="playback"
            :lap-duration-ms="lapDurationMs"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
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
    </PageExampleKnobs>
</template>
