<script setup lang="ts">
import { useModel } from "vue";

import { SlideButton } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps & {
    "progress"?: number;
    "onUpdate:progress"?: (ratio: number) => void;
};

const props = defineProps<Props>();

const progress = useModel(props, "progress");
</script>

<template>
    <SlideButton :thumb-size="SLIDE_BUTTON_THUMB_SIZE" v-model:progress="progress" @activate="props.onActivate">
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">Slide or hold to send</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
