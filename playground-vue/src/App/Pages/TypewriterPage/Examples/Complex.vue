<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Typewriter } from "@thewaver/ss-components-vue";
import type { TypewriterController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { TypewriterComplexExampleProps } from "../TypewriterPageVue.types";

type Props = TypewriterComplexExampleProps;

const props = defineProps<Props>();

const controller = shallowRef<TypewriterController>();
const isPlaying = shallowRef(true);
const isVanishing = shallowRef(false);

const setController = (next: TypewriterController) => {
    controller.value = next;
};

const computeAnimationName = (character: string, index: number, count: number) =>
    isVanishing.value ? styles.typewriterVanish : props.computeAnimationName(character, index, count);

const fadeIn = () => {
    isVanishing.value = false;
    controller.value?.restartAnimation();
};

const fadeOut = () => {
    isVanishing.value = true;
    controller.value?.restartAnimation();
};

const stopIfVanishing = () => {
    if (isVanishing.value) isPlaying.value = false;
};
</script>

<template>
    <div :class="styles.complexStack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <Typewriter
                v-model:playback="isPlaying"
                :compute-animation-name="computeAnimationName"
                :compute-character-weights="computeCharacterWeights"
                @mount="setController"
                @animation-end="stopIfVanishing"
                >{{ "This is a bit of "
                }}<b
                    >text that appears
                    <div :class="styles.textHighlight" :style="{ color: 'red' }" title="ONE MEANS ONE!">
                        <i>one</i>
                    </div></b
                ><span>single</span>{{ " text character\tat a time," }}<br /><br />
                <div :style="{ width: '100%', height: '0.5em', borderBottom: '2px solid currentColor' }" />
                {{ "and has\nescaped "
                }}<img :src="knight" alt="" :height="24" :style="{ verticalAlign: 'middle' }" /><a
                    href="http://www.google.com"
                    >characters.</a
                ></Typewriter
            >
        </PageMeasureBox>

        <div :class="styles.complexControls">
            <Button id="typeItAgain" @click="fadeIn">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags">Fade in</PageControlButtonContent>
                </template>
            </Button>

            <Button id="fadeItOut" @click="fadeOut">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags">Fade out</PageControlButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
