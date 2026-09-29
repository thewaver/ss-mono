<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ScratchCard } from "@thewaver/ss-components-vue";
import type { ScratchCardController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

const CARD_WIDTH = 360;

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
                    ariaLabel="Rub the frost away"
                    @mount="(next: ScratchCardController) => (controller = next)"
                    @scratch="props.onScratch"
                    @clear="props.onClear"
                >
                    <template #renderContent>
                        <div :class="styles.pane">
                            <span :class="styles.paneTitle">Frosted, not opaque</span>
                            <span>A cover that blurs rather than hides means the rub sharpens what is under it.</span>
                        </div>
                    </template>

                    <template #renderCover="maskStyle">
                        <div :class="styles.frost" :style="maskStyle" />
                    </template>
                </ScratchCard>
            </div>
        </PageMeasureBox>

        <div :class="styles.buttonRow">
            <Button id="newFrost" @click="reset">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Re-freeze</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
