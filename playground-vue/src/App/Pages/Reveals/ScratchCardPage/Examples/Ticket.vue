<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ScratchCard } from "@thewaver/ss-components-vue";
import type { ScratchCardController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

const CARD_WIDTH = 360;
const PRIZE = "★ 10 000 ★";

type Props = ScratchCardExampleProps;

const props = defineProps<Props>();

const controller = shallowRef<ScratchCardController>();

const reset = () => {
    controller.value?.reset();
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="CARD_WIDTH">
            <div :class="styles.card">
                <ScratchCard
                    :brush-radius="brushRadius"
                    :precision="precision"
                    :softness="softness"
                    :compute-points="computePoints"
                    :clear-threshold="clearThreshold"
                    ariaLabel="Scratch to reveal the prize"
                    @mount="(next: ScratchCardController) => (controller = next)"
                    @scratch="props.onScratch"
                    @clear="props.onClear"
                >
                    <template #renderContent>
                        <div :class="styles.prize">{{ PRIZE }}</div>
                    </template>

                    <template #renderCover="maskStyle">
                        <div :class="styles.foil" :style="maskStyle" />
                    </template>

                    <template #renderBrush="{ isRubbing, geometry }">
                        <div
                            :class="[styles.coin, isRubbing && styles.coinRubbing]"
                            :style="{ clipPath: geometry.clipPath }"
                        />
                    </template>
                </ScratchCard>
            </div>
        </PageMeasureBox>

        <div :class="styles.buttonRow">
            <Button id="newTicket" ariaLabel="New ticket" @click="reset">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
                </template>
            </Button>
        </div>
    </div>
</template>
