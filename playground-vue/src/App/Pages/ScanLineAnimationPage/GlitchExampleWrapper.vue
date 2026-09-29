<script setup lang="ts">
import { reactive } from "vue";

import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import GlitchExample from "./Examples/Glitch.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

const IMAGE_CONTAINER_SIZE = 360;

const props = defineProps<ScanlineAnimationExampleProps>();

const keyframeOpts = reactive({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });
</script>

<template>
    <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
        <GlitchExample v-bind="props" :keyframe-opts="keyframeOpts" />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp item-key="count" label="Count" hint="How many glitch bursts happen over one pass.">
            <PageNumberField
                :value="keyframeOpts.count"
                :min="ScanlineAnimationKnobs.MIN_GLITCH_COUNT"
                :max="ScanlineAnimationKnobs.MAX_GLITCH_COUNT"
                :step="ScanlineAnimationKnobs.GLITCH_COUNT_STEP"
                ariaLabel="Count"
                @input="(value: number) => (keyframeOpts.count = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxShift"
            label="Max shift (%)"
            hint="How far a line can be thrown sideways at the worst of a burst, as a share of its own width."
        >
            <PageNumberField
                :value="keyframeOpts.shiftPercent"
                :min="ScanlineAnimationKnobs.MIN_SHIFT_PERCENT"
                :max="ScanlineAnimationKnobs.MAX_SHIFT_PERCENT"
                :step="ScanlineAnimationKnobs.SHIFT_PERCENT_STEP"
                ariaLabel="Shift percent"
                @input="(value: number) => (keyframeOpts.shiftPercent = value)"
            />
        </PageProp>

        <PageProp
            item-key="chunkyness01"
            label="Chunkyness (0-1)"
            hint="How blocky the glitch is: low values throw single lines about, high values throw thick slabs."
        >
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
