<script setup lang="ts">
import { shallowRef } from "vue";

import { SlideButton } from "@thewaver/ss-components-vue";
import { HOLD_ENTER_SPACE_SEND_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import type { SlideButtonDirectionsDocsExampleProps } from "../SlideButtonPageVue.types";

type Props = SlideButtonDirectionsDocsExampleProps;

defineProps<Props>();

const sends = shallowRef(0);
</script>

<template>
    <div :dir="direction">
        <SlideButton
            :ariaDescription="HOLD_ENTER_SPACE_SEND_DESCRIPTION"
            :orientation="orientation"
            :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
            @activate="() => void sends++"
        >
            <template #renderContent="renderProps">
                <PageSlideButtonContent :render-props="renderProps">{{
                    `Slide or hold (${sends})`
                }}</PageSlideButtonContent>
            </template>
        </SlideButton>
    </div>
</template>
