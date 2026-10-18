<script setup lang="ts">
import { type ComponentPublicInstance, onBeforeUnmount, shallowRef } from "vue";

import { Button, MediaQueryMonitorVueUtils, toElement } from "@thewaver/ss-components-vue";
import {
    NO_MOTION_DURATION_MS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import { appliedTheme, revealTheme } from "../../../PageComponents/Theme/ThemeVue.const";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ShapeRevealExampleProps } from "../ShapeRevealExample.types";

type Props = ShapeRevealExampleProps;

const props = defineProps<Props>();

const pickOtherTheme = (current: PlaygroundTheme) => {
    const others = THEME_OPTIONS.filter((option) => option.value !== current);

    return others[Math.floor(Math.random() * others.length)].value;
};

const isCycling = shallowRef(false);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const buttonRef = shallowRef<HTMLElement>();

const setButtonRef = (target: Element | ComponentPublicInstance | null) => {
    buttonRef.value = toElement(target);
};

let delayTimer: ReturnType<typeof setTimeout> | undefined;
let runId = 0;

const cycle = async (id: number) => {
    await revealTheme(pickOtherTheme(appliedTheme.value), {
        origin: buttonRef.value,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : props.durationMs,
        computePoints: props.computePoints,
        softness: props.softness,
    });

    if (id !== runId) return;

    delayTimer = setTimeout(() => void cycle(id), props.delayMs);
};

const stop = () => {
    runId += 1;
    clearTimeout(delayTimer);
    isCycling.value = false;
};

const toggle = () => {
    if (isCycling.value) return stop();

    isCycling.value = true;
    void cycle(runId);
};

onBeforeUnmount(stop);
</script>

<template>
    <Button :ref="setButtonRef" @click="toggle">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ isCycling ? "Stop cycling" : "Start cycling" }}</PageButtonContent>
        </template>
    </Button>
</template>
