<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

const count = shallowRef(0);

let repeatTimer: ReturnType<typeof setTimeout> | undefined;
let isPointerPress = false;

const step = (by: number) => {
    count.value += by;
};

const stopRepeating = () => {
    clearTimeout(repeatTimer);
};

const repeat = (by: number, waitMs: number) => {
    repeatTimer = setTimeout(() => {
        step(by);
        repeat(by, REPEAT_INTERVAL_MS);
    }, waitMs);
};

const pressDown = (by: number) => {
    isPointerPress = true;
    step(by);
    repeat(by, REPEAT_DELAY_MS);
};

const pressUp = (e: PointerEvent) => {
    stopRepeating();

    if (e.type === "pointercancel") isPointerPress = false;
};

const leave = () => {
    stopRepeating();
    isPointerPress = false;
};

const click = (by: number) => {
    if (isPointerPress) {
        isPointerPress = false;

        return;
    }

    step(by);
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
