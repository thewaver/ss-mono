<script setup lang="ts">
import { Button, SlideButton } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonHeldExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonHeldExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <PageControlColumn>
        <SlideButton :is-pressed="isArmed" :thumb-size="SLIDE_BUTTON_THUMB_SIZE" @activate="props.onActivate">
            <template #renderContent="renderProps">
                <PageSlideButtonContent :render-props="renderProps">Slide or hold to arm</PageSlideButtonContent>
            </template>
        </SlideButton>

        <Button :is-disabled="!isArmed" @click="props.onReset">
            <template #renderContent="renderProps">
                <PageButtonContent :flags="renderProps">Reset</PageButtonContent>
            </template>
        </Button>
    </PageControlColumn>
</template>
