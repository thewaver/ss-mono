<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ScrambleTextWeights } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { TypewriterKnobs } from "../../Knobs/Typewriters.const";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import ComplexExampleWrapper from "./ComplexExampleWrapper.vue";
import CustomInputExampleWrapper from "./CustomInputExampleWrapper.vue";
import KaraokeExample from "./Examples/Karaoke.vue";
import OutwardExample from "./Examples/Outward.vue";
import PhrasesExample from "./Examples/Phrases.vue";
import ScrollLitExample from "./Examples/ScrollLit.vue";
import type { TypewriterExampleWrapperProps, TypewriterTextEffect } from "./TypewriterPage.types";

const TEXT_EFFECTS: TypewriterTextEffect[] = ["fade", "scale", "glow", "drop", "slide"];
const TEXT_EFFECT_MAP: Record<TypewriterTextEffect, string> = {
    fade: styles.typewriterFade,
    scale: styles.typewriterScale,
    glow: styles.typewriterGlow,
    drop: styles.typewriterDrop,
    slide: styles.typewriterSlide,
};

const EXAMPLES_ROOT = "/src/App/Pages/TypewriterPage/Examples";

type ArrivalOrder = (typeof TypewriterKnobs.ARRIVAL_ORDERS)[number];

const textContainerWidth = shallowRef(TypewriterKnobs.STARTING_WIDTH);
const textEffect = shallowRef<TypewriterTextEffect>(TypewriterKnobs.STARTING_TEXT_EFFECT);
const arrivalOrder = shallowRef<ArrivalOrder>(TypewriterKnobs.STARTING_ARRIVAL_ORDER);

const commonProps = computed<TypewriterExampleWrapperProps>(() => {
    const order = arrivalOrder.value;

    return {
        width: textContainerWidth.value,
        computeAnimationName: () => TEXT_EFFECT_MAP[textEffect.value],
        computeCharacterWeights: (count) =>
            order === "leftToRight" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[order](count),
    };
});

const examples: ExampleDefs[] = [
    {
        key: "complex",
        name: "Complex",
        path: `${EXAMPLES_ROOT}/Complex.vue`,
    },
    {
        key: "customInput",
        name: "Custom Input",
        path: `${EXAMPLES_ROOT}/CustomInput.vue`,
    },
    {
        key: "phrases",
        name: "Phrases",
        readout: () =>
            "the example owns the loop: each run's end either holds the phrase and switches to erasing, or moves to the next phrase and types it, and the caret is placed from the same progress the characters are drawn from",
        path: `${EXAMPLES_ROOT}/Phrases.vue`,
    },
    {
        key: "karaoke",
        name: "Karaoke",
        readout: () =>
            "the line and the slider share one progress: singing writes it as it goes, and dragging the slider draws that moment — a stop can fall partway through a letter's own sweep",
        path: `${EXAMPLES_ROOT}/Karaoke.vue`,
    },
    {
        key: "scrollLit",
        name: "Lit by scrolling",
        readout: () =>
            "playback is off and the progress is how far the paragraph has traveled up its box; the letters not yet reached show their animation's first frame, which is the dimmed text",
        path: `${EXAMPLES_ROOT}/ScrollLit.vue`,
    },
    {
        key: "outward",
        name: "Flying outward",
        readout: () =>
            "an animation per letter: the left half flies off to the left and the right half to the right, from the middle out, as the line crosses the middle of its box",
        path: `${EXAMPLES_ROOT}/Outward.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="textContainerWidth"
                label="Container width (px)"
                hint="How wide the box holding the text is, which decides where the lines wrap as the text is typed."
            >
                <PageNumberField
                    :value="textContainerWidth"
                    :min="TypewriterKnobs.MIN_CONTAINER_WIDTH"
                    :max="TypewriterKnobs.MAX_CONTAINER_WIDTH"
                    :step="TypewriterKnobs.CONTAINER_WIDTH_STEP"
                    ariaLabel="Container width in pixels"
                    @input="(value: number) => (textContainerWidth = value)"
                />
            </PageProp>

            <PageProp
                item-key="textEffect"
                label="Effect"
                hint="How each character arrives: plainly, or with one of the entrance effects."
            >
                <PageSelectField
                    :value="textEffect"
                    :values="TEXT_EFFECTS"
                    ariaLabel="Effect"
                    @change="(effect: TypewriterTextEffect) => (textEffect = effect)"
                />
            </PageProp>

            <PageProp
                item-key="arrivalOrder"
                label="Arrival order"
                hint="The order the characters arrive in: left to right, from the middle out, scattered, and so on. Erasing runs it backwards. The caret is meant for left to right, and jumps about under the others."
            >
                <PageSelectField
                    :value="arrivalOrder"
                    :values="TypewriterKnobs.ARRIVAL_ORDERS"
                    ariaLabel="Arrival order"
                    @change="(order: ArrivalOrder) => (arrivalOrder = order)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #complex>
                <ComplexExampleWrapper v-bind="commonProps" />
            </template>

            <template #customInput>
                <CustomInputExampleWrapper v-bind="commonProps" />
            </template>

            <template #phrases>
                <PhrasesExample v-bind="commonProps" />
            </template>

            <template #karaoke>
                <PageMeasureBox :width="textContainerWidth" :padding="MEASURE_BOX_PADDING">
                    <KaraokeExample />
                </PageMeasureBox>
            </template>

            <template #scrollLit>
                <PageMeasureBox :width="textContainerWidth">
                    <ScrollLitExample />
                </PageMeasureBox>
            </template>

            <template #outward>
                <PageMeasureBox :width="textContainerWidth">
                    <OutwardExample />
                </PageMeasureBox>
            </template>
        </PageExamples>
    </div>
</template>
