<script setup lang="ts">
import { Button, ScratchCard } from "@thewaver/ss-components-vue";
import type { ScratchCardController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ScratchCardWindowsExampleProps } from "../ScratchCardPage.types";

const TICKET_WIDTH = 360;
const SYMBOLS = ["★", "♦", "★"];
const FIRST_WINDOW = 1;

type Props = ScratchCardWindowsExampleProps;

const props = defineProps<Props>();

const controllers: ScratchCardController[] = [];

const resetAll = () => {
    controllers.forEach((controller) => controller.reset());
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="TICKET_WIDTH">
            <div :class="styles.windows">
                <div v-for="(symbol, index) in SYMBOLS" :key="index" :class="styles.card">
                    <ScratchCard
                        :brush-radius="brushRadius"
                        :precision="precision"
                        :softness="softness"
                        :compute-points="computePoints"
                        :clear-threshold="clearThreshold"
                        :ariaLabel="`Scratch window ${index + FIRST_WINDOW}`"
                        @mount="(controller: ScratchCardController) => (controllers[index] = controller)"
                        @scratch="(ratio: number) => props.onWindowScratch(index, ratio)"
                        @clear="props.onWindowClear(index)"
                    >
                        <template #renderContent>
                            <div :class="styles.windowPrize">{{ symbol }}</div>
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
            </div>
        </PageMeasureBox>

        <div :class="styles.buttonRow">
            <Button id="newWindowsTicket" @click="resetAll">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">New ticket</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
