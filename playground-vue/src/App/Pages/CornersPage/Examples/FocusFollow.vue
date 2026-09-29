<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Button, Corners, ElementObserverVueUtils, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
import type { Rect } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const BOX_PADDING_PX = 8;
const CONTROLS = ["Open", "Save", "Share", "Delete"];

const props = defineProps<Props>();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const stageRef = shallowRef<HTMLDivElement>();

const hovered = shallowRef<HTMLElement>();
const focused = shallowRef<HTMLElement>();
const boxRect = shallowRef<Rect>();

const target = computed(() => hovered.value ?? focused.value);

const stageRect = ElementObserverVueUtils.useViewportRect(stageRef, true);
const targetRect = ElementObserverVueUtils.useViewportRect(target, () => target.value !== undefined, {
    padding: BOX_PADDING_PX,
});

watch([stageRect, targetRect, target], ([stage, targetBox, current]) => {
    if (!stage || !targetBox || !current) return;

    boxRect.value = {
        x: targetBox.x - stage.x,
        y: targetBox.y - stage.y,
        width: targetBox.width,
        height: targetBox.height,
    };
});

const glideMs = computed(() => (prefersReducedMotion.value ? 0 : props.transitionDurationMs));

const focusSlot = (e: FocusEvent) => {
    if ((e.target as HTMLElement).matches(":focus-visible")) focused.value = e.currentTarget as HTMLElement;
};
</script>

<template>
    <div ref="stageRef" :class="styles.followStage">
        <div
            v-for="label in CONTROLS"
            :key="label"
            :class="styles.followSlot"
            @pointerenter="(e: PointerEvent) => (hovered = e.currentTarget as HTMLElement)"
            @pointerleave="hovered = undefined"
            @focusin="focusSlot"
            @focusout="focused = undefined"
        >
            <Button>
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ label }}</PageButtonContent>
                </template>
            </Button>
        </div>

        <div
            v-if="boxRect"
            :class="styles.followBox"
            :style="{
                left: `${boxRect.x}px`,
                top: `${boxRect.y}px`,
                width: `${boxRect.width}px`,
                height: `${boxRect.height}px`,
                transitionDuration: `${glideMs}ms`,
            }"
        >
            <Corners
                :color="target ? color : TRANSPARENT"
                :corner-length="cornerLength"
                :stroke-thickness="strokeThickness"
                :transition-duration-ms="transitionDurationMs"
                :visible-corners="visibleCorners"
            />
        </div>
    </div>
</template>
