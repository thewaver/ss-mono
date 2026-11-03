<script setup lang="ts">
import { SlideButton } from "@thewaver/ss-components-vue";
import { LOOK_SAMPLE_SLIDE_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { LookStateProps } from "./LooksPage.types";

withDefaults(defineProps<LookStateProps>(), { isDisabled: undefined, hasError: undefined });
</script>

<template>
    <SlideButton
        :ariaDescription="LOOK_SAMPLE_SLIDE_DESCRIPTION"
        :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
        :is-disabled="isDisabled"
        :has-error="hasError"
    >
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">{{ state }}</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
