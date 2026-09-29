<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, FrameRateMonitorVueUtils, Modal } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/StressTest/StressTest.css";
import { CSSUtils } from "@thewaver/ss-utils";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../StyledComponents/ModalPanel/PageModalPanel.vue";
import PagePropsPanel from "../PropsPanel/PagePropsPanel.vue";
import type { StressTestProps, StressTestSlots } from "./StressText.types";

const props = defineProps<StressTestProps>();

defineSlots<StressTestSlots>();

const isModalOpen = shallowRef(false);
const isModalTransitionFinished = shallowRef(false);
const configIndex = shallowRef(0);

const arr = computed(() => Array.from({ length: props.configs[configIndex.value].count }, (_, idx) => idx));

const frameRate = FrameRateMonitorVueUtils.useFrameRate(() => !(isModalOpen.value && isModalTransitionFinished.value));

const fpsVariant = computed(() =>
    frameRate.value.average >= 59.5 ? "good" : frameRate.value.average >= 29.5 ? "mid" : "bad",
);

const openConfig = async (index: number) => {
    configIndex.value = index;
    isModalOpen.value = true;
};

const setModalTransitionFinished = (hasTransitionFinished: boolean) => {
    isModalTransitionFinished.value = hasTransitionFinished;
};
</script>

<template>
    <PagePropsPanel scope="local">
        <Button v-for="(_, index) in configs" :key="index" sizing="fill" @click="() => openConfig(index)">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags"><slot name="renderLabel" :configIndex="index" /></PageButtonContent>
            </template>
        </Button>
    </PagePropsPanel>

    <Modal
        v-model:visibility="isModalOpen"
        :margins="CSSUtils.spreadMargin(40)"
        ariaLabel="Stress test"
        @show="props.onShowModal?.()"
        @hide="props.onHideModal?.()"
        @transition-status-change="setModalTransitionFinished"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :class="[styles.fpsCounter, styles.fpsCounterVariants[fpsVariant]]">{{
                    `FPS: ${frameRate.current.toFixed(1)}\nAVG: ${frameRate.average.toFixed(1)}`
                }}</div>
                <div
                    :class="styles.itemGrid"
                    :style="{
                        gridTemplateColumns: `repeat(${configs[configIndex].cols}, auto)`,
                        gap: `${configs[configIndex].gap}px`,
                    }"
                >
                    <template v-for="index in arr" :key="index">
                        <slot name="renderItem" :configIndex="configIndex" :itemIndex="index" />
                    </template>
                </div>
            </PageModalPanel>
        </template>
    </Modal>
</template>
