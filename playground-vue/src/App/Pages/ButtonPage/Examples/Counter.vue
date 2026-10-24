<script setup lang="ts">
import { onBeforeUnmount } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ButtonCounterExampleProps } from "../ButtonPageVue.types";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

type Props = ButtonCounterExampleProps;

const props = defineProps<Props>();

let repeatTimer: ReturnType<typeof setTimeout> | undefined;
let isPointerPress = false;

const stopRepeating = () => {
    clearTimeout(repeatTimer);
};

const repeat = (step: number, waitMs: number) => {
    repeatTimer = setTimeout(() => {
        props.onStep(step);
        repeat(step, REPEAT_INTERVAL_MS);
    }, waitMs);
};

const pressDown = (step: number) => {
    isPointerPress = true;
    props.onStep(step);
    repeat(step, REPEAT_DELAY_MS);
};

const pressUp = (e: PointerEvent) => {
    stopRepeating();

    if (e.type === "pointercancel") isPointerPress = false;
};

const leave = () => {
    stopRepeating();
    isPointerPress = false;
};

const click = (step: number) => {
    if (isPointerPress) {
        isPointerPress = false;

        return;
    }

    props.onStep(step);
};

onBeforeUnmount(stopRepeating);
</script>

<template>
    <div :class="styles.counter">
        <Button
            ariaLabel="Decrease"
            @pointer-down="pressDown(-1)"
            @pointer-up="pressUp"
            @mouse-leave="leave"
            @click="click(-1)"
        >
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" glyph="▼" />
            </template>
        </Button>

        <div :class="styles.counterValue">{{ count }}</div>

        <Button
            ariaLabel="Increase"
            @pointer-down="pressDown(1)"
            @pointer-up="pressUp"
            @mouse-leave="leave"
            @click="click(1)"
        >
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" glyph="▲" />
            </template>
        </Button>
    </div>
</template>
