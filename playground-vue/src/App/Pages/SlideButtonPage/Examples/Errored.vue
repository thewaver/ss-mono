<script setup lang="ts">
import { SlideButton } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonErroredExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonErroredExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <SlideButton :has-error="hasError" :thumb-size="SLIDE_BUTTON_THUMB_SIZE" @activate="props.onActivate">
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">Slide or hold to retry</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
