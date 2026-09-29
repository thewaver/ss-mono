<script setup lang="ts">
import { SlideButton } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

const HOLD_DURATION_MS = 2000;

const props = defineProps<Props>();
</script>

<template>
    <SlideButton
        mode="hold"
        :hold-duration-ms="HOLD_DURATION_MS"
        :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
        @activate="props.onActivate"
    >
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">Hold to send</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
