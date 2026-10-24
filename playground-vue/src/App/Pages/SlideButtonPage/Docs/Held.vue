<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, SlideButton } from "@thewaver/ss-components-vue";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";

const isArmed = shallowRef(false);
</script>

<template>
    <PageControlRow>
        <SlideButton
            ariaDescription="Hold Enter or Space to arm."
            :is-pressed="isArmed"
            :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
            @activate="isArmed = true"
        >
            <template #renderContent="renderProps">
                <PageSlideButtonContent :render-props="renderProps">Slide or hold to arm</PageSlideButtonContent>
            </template>
        </SlideButton>

        <Button :is-disabled="!isArmed" ariaLabel="Reset" @click="() => void (isArmed = false)">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
            </template>
        </Button>
    </PageControlRow>
</template>
