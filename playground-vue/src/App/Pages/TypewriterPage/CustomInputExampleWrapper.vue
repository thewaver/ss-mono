<script setup lang="ts">
import { shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import CustomInputExample from "./Examples/CustomInput.vue";
import type { TypewriterExampleWrapperProps } from "./TypewriterPage.types";

const CUSTOM_TEXT_WIDTH = 320;
const CUSTOM_TEXT_MIN_ROWS = 6;
const CUSTOM_TEXT_MAX_ROWS = 12;

defineProps<TypewriterExampleWrapperProps>();

const text = shallowRef("Line one\n\nline two");
</script>

<template>
    <TextArea
        v-model:value="text"
        is-auto-sizing
        :min-rows="CUSTOM_TEXT_MIN_ROWS"
        :max-rows="CUSTOM_TEXT_MAX_ROWS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Custom text"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="CUSTOM_TEXT_WIDTH" is-stretched />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags" is-top-aligned>Put custom text inside me</PageTextFieldPlaceholder>
        </template>
    </TextArea>

    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <CustomInputExample
            :animation-name="animationName"
            :compute-character-weights="computeCharacterWeights"
            :text="text"
        />
    </PageMeasureBox>
</template>
