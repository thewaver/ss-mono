<script setup lang="ts">
import { SlideButton } from "@thewaver/ss-components-vue";
import { SKIN_SAMPLE_SLIDE_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SkinStateProps } from "./AppearancePage.types";

withDefaults(defineProps<SkinStateProps>(), { isDisabled: undefined, hasError: undefined });
</script>

<template>
    <SlideButton
        :ariaDescription="SKIN_SAMPLE_SLIDE_DESCRIPTION"
        :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
        :is-disabled="isDisabled"
        :has-error="hasError"
    >
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">{{ state }}</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
