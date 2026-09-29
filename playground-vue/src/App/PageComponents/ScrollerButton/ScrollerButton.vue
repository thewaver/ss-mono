<script setup lang="ts">
import { computed } from "vue";

import { Button } from "@thewaver/ss-components-vue";

import PageScrollerButtonContent from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent.vue";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const props = defineProps<ScrollerButtonProps>();

const isPrevious = computed(() => props.step === "previous");
</script>

<template>
    <Button
        :is-disabled="isPrevious ? stepper.getIsAtStart() : stepper.getIsAtEnd()"
        :ariaLabel="isPrevious ? 'Scroll back' : 'Scroll forward'"
        @click="() => void (isPrevious ? stepper.stepToPrevious() : stepper.stepToNext())"
    >
        <template #renderContent="flags">
            <PageScrollerButtonContent :flags="flags" :step="step" />
        </template>
    </Button>
</template>
