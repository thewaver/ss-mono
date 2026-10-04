<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as typewriterStyles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import TypedExample from "./Examples/Typed.vue";
import type { PaintedTextExampleProps, PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

const ARRIVAL_EFFECTS = ["fade", "scale", "glow", "drop", "slide"] as const;

type ArrivalEffect = (typeof ARRIVAL_EFFECTS)[number];

const ARRIVAL_EFFECT_NAMES: Record<ArrivalEffect, string> = {
    fade: typewriterStyles.typewriterFade,
    scale: typewriterStyles.typewriterScale,
    glow: typewriterStyles.typewriterGlow,
    drop: typewriterStyles.typewriterDrop,
    slide: typewriterStyles.typewriterSlide,
};

const props = defineProps<PaintedTextExampleWrapperProps>();

const arrivalEffect = shallowRef<ArrivalEffect>(PaintedTextKnobs.STARTING_ARRIVAL_EFFECT);

const exampleProps = computed((): PaintedTextExampleProps => {
    const { width: _width, ...rest } = props;

    return rest;
});
</script>

<template>
    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <TypedExample v-bind="exampleProps" :compute-animation-name="() => ARRIVAL_EFFECT_NAMES[arrivalEffect]" />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp
            item-key="arrivalEffect"
            label="Arrival effect"
            hint="How each letter arrives. The keyframes are the Typewriter page's own, played by the painted letters."
        >
            <PageSelectField
                :value="arrivalEffect"
                :values="ARRIVAL_EFFECTS"
                ariaLabel="Arrival effect"
                @change="(effect: ArrivalEffect) => (arrivalEffect = effect)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
