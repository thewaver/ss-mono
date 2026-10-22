<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, watch } from "vue";

import { Button, ButtonStyles, InteractionTrackerVueUtils, InteractionWrapper } from "@thewaver/ss-components-vue";
import type { CarouselStep } from "@thewaver/ss-components-vue";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageCarouselBar from "../../StyledComponents/CarouselContent/PageCarouselBar.vue";
import PageCarouselPick from "../../StyledComponents/CarouselContent/PageCarouselPick.vue";
import PageCarouselRotation from "../../StyledComponents/CarouselContent/PageCarouselRotation.vue";
import PageCarouselStep from "../../StyledComponents/CarouselContent/PageCarouselStep.vue";
import type { PageCarouselsBarProps } from "./Carousels.types";

const props = defineProps<PageCarouselsBarProps>();

const barRef = shallowRef<ComponentPublicInstance>();

const isHeld = InteractionTrackerVueUtils.useHold(() => barRef.value?.$el as HTMLElement | undefined);

watch(
    isHeld,
    (next) => {
        props.controls.setIsHeldByPage(next);
    },
    { immediate: true },
);

const step = (direction: CarouselStep) => {
    props.controls.step(direction);
};

const pick = (index: number, isDisabled?: boolean) => {
    if (isDisabled) return;

    props.controls.pick(index);
};

const toggle = () => {
    props.controls.setIsPlaying(!props.controls.getIsPlaying());
};
</script>

<template>
    <PageCarouselBar ref="barRef">
        <Button
            v-if="hasRotation"
            :ariaLabel="computeCarouselRotationLabel(controls.getIsPlaying())"
            :is-disabled="isDisabled"
            @click="toggle"
        >
            <template #renderContent="flags">
                <PageCarouselRotation :flags="flags" :is-playing="controls.getIsPlaying()" />
            </template>
        </Button>

        <Button
            :ariaLabel="computeCarouselStepLabel('previous')"
            :is-disabled="!controls.getCanStep('previous')"
            @click="step('previous')"
        >
            <template #renderContent="flags">
                <PageCarouselStep :flags="flags" step="previous" />
            </template>
        </Button>

        <template v-if="hasPicks">
            <InteractionWrapper
                v-for="(_unused, pickIndex) in controls.getCount()"
                :key="pickIndex"
                :is-disabled="isDisabled"
            >
                <template #renderControl="{ setElementRef, flags }">
                    <button
                        :ref="setElementRef"
                        type="button"
                        :class="ButtonStyles.buttonElement"
                        :aria-label="computePositionLabel(pickIndex, controls.getCount())"
                        :aria-current="pickIndex === controls.getIndex() || undefined"
                        :aria-disabled="flags.isDisabled || undefined"
                        @click="pick(pickIndex, flags.isDisabled)"
                    >
                        <PageCarouselPick :flags="flags" :is-current="pickIndex === controls.getIndex()" />
                    </button>
                </template>
            </InteractionWrapper>
        </template>

        <Button
            :ariaLabel="computeCarouselStepLabel('next')"
            :is-disabled="!controls.getCanStep('next')"
            @click="step('next')"
        >
            <template #renderContent="flags">
                <PageCarouselStep :flags="flags" step="next" />
            </template>
        </Button>
    </PageCarouselBar>
</template>
