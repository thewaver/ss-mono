<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Typewriter } from "@thewaver/ss-components-vue";
import type { TypewriterController } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import knight from "@thewaver/ss-playground/App/knight.webp";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { TypewriterComplexExampleProps } from "../TypewriterPage.types";

type Props = TypewriterComplexExampleProps;

defineProps<Props>();

const controller = shallowRef<TypewriterController>();

const setController = (next: TypewriterController) => {
    controller.value = next;
};

const restart = () => {
    controller.value?.restartAnimation();
};
</script>

<template>
    <div :class="styles.complexStack">
        <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
            <Typewriter
                :compute-animation-name="computeAnimationName"
                :compute-character-weights="computeCharacterWeights"
                @mount="setController"
                >{{ "This is a bit of "
                }}<b
                    >text that appears
                    <div :class="styles.textHighlight" :style="{ color: 'red' }" title="ONE MEANS ONE!">
                        <i>one</i>
                    </div></b
                ><span>single</span>{{ " text character\tat a time," }}<br /><br />
                <div :style="{ width: '100%', height: '0.5em', borderBottom: '2px solid currentColor' }" />
                {{ "and has\nescaped " }}<img :src="knight" :height="24" :style="{ verticalAlign: 'middle' }" /><a
                    href="http://www.google.com"
                    >characters.</a
                ></Typewriter
            >
        </PageMeasureBox>

        <Button id="typeItAgain" ariaLabel="Type it again" @click="restart">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
            </template>
        </Button>
    </div>
</template>
