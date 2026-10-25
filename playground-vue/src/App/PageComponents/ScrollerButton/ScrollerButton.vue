<script setup lang="ts">
import { computed } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { ScrollerAxis, ScrollerStep } from "@thewaver/ss-components-vue";

import PageScrollerButtonContent from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent.vue";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
    x: { previous: "Scroll back", next: "Scroll forward" },
    y: { previous: "Scroll up", next: "Scroll down" },
};

const props = defineProps<ScrollerButtonProps>();

const axis = computed(() => props.axis ?? "x");

const isPrevious = computed(() => props.step === "previous");
</script>

<template>
    <Button
        v-if="controller"
        :id="id"
        :is-disabled="isPrevious ? controller[axis].getIsAtStart() : controller[axis].getIsAtEnd()"
        :ariaLabel="ARIA_LABELS[axis][step]"
        :ariaControls="controller.getBoxId()"
        @click="() => void (isPrevious ? controller?.[axis].stepToPrevious() : controller?.[axis].stepToNext())"
    >
        <template #renderContent="flags">
            <PageScrollerButtonContent :flags="flags" :step="step" :axis="axis" />
        </template>
    </Button>
</template>
