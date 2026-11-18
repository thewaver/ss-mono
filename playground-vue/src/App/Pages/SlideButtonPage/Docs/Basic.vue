<script setup lang="ts">
import { shallowRef } from "vue";

import { SlideButton } from "@thewaver/ss-components-vue";
import { HOLD_ENTER_SPACE_SEND_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonDocsExampleProps } from "../SlideButtonPageVue.types";

type Props = SlideButtonDocsExampleProps;

defineProps<Props>();

const sends = shallowRef(0);
</script>

<template>
    <SlideButton
        :ariaDescription="HOLD_ENTER_SPACE_SEND_DESCRIPTION"
        :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
        :mode="mode"
        :completion-ratio="completionRatio"
        :hold-duration-ms="holdDurationMs"
        :is-disabled="isDisabled"
        :has-error="hasError"
        @activate="() => void sends++"
    >
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">{{
                `Slide or hold (${sends})`
            }}</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
