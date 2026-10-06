<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from "vue";

import { Button, Corners, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
import { EasingUtils, MathUtils } from "@thewaver/ss-utils";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const NOT_GROWN = 0;
const FULLY_GROWN = 1;

const props = defineProps<Props>();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isShown = shallowRef(false);
const growth = shallowRef(NOT_GROWN);

let frame: number | undefined;

const stopTween = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);

    frame = undefined;
};

onBeforeUnmount(stopTween);

const drawOn = () => {
    stopTween();

    const durationMs = props.transitionDurationMs;

    if (prefersReducedMotion.value || durationMs <= 0) {
        growth.value = FULLY_GROWN;

        return;
    }

    const startedAt = performance.now();

    growth.value = NOT_GROWN;

    const step = (now: number) => {
        const ratio = MathUtils.clamp01((now - startedAt) / durationMs);

        growth.value = EasingUtils.easeOut(ratio);

        frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
    };

    frame = requestAnimationFrame(step);
};

const toggle = () => {
    if (!isShown.value) drawOn();

    isShown.value = !isShown.value;
};

const cornerLength = computed(() => ({
    width: Math.max(props.strokeThickness, props.cornerLength.width * growth.value),
    height: Math.max(props.strokeThickness, props.cornerLength.height * growth.value),
}));
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.frame">
            <Corners
                :color="isShown ? color : TRANSPARENT"
                :corner-length="cornerLength"
                :stroke-thickness="strokeThickness"
                :transition-duration-ms="transitionDurationMs"
                :visible-corners="visibleCorners"
            >
                <div :class="styles.frameBody">The arms grow out of each corner</div>
            </Corners>
        </div>

        <div :class="styles.controlRow">
            <Button id="cornersDrawOn" :is-pressed="isShown" @click="toggle">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags">{{ isShown ? "Hide" : "Draw" }}</PageControlButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
