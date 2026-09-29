<script setup lang="ts">
import { FormField, SlideButton } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

const HINT = "Hold the button, or slide it all the way, to send.";

type Props = SlideButtonExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <FormField :message="HINT">
        <template #renderCaption>
            <PageFormFieldCaption>Send the report</PageFormFieldCaption>
        </template>

        <template #renderMessage="fieldState">
            <PageFormFieldMessage :state="fieldState">{{ HINT }}</PageFormFieldMessage>
        </template>

        <template #renderControl>
            <SlideButton ariaLabel="Send the report" :thumb-size="SLIDE_BUTTON_THUMB_SIZE" @activate="props.onActivate">
                <template #renderContent="renderProps">
                    <PageSlideButtonContent :render-props="renderProps">Slide or hold to send</PageSlideButtonContent>
                </template>
            </SlideButton>
        </template>
    </FormField>
</template>
