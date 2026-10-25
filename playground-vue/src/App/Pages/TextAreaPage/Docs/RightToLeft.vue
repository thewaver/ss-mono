<script setup lang="ts">
import { shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const STARTING_TEXT = "One line\nTwo lines\nThree lines, and the third one wraps onto a fourth";

const value = shallowRef(STARTING_TEXT);
</script>

<template>
    <div dir="rtl">
        <TextArea
            v-model:value="value"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            ariaLabel="Notes"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" :height="FIXED_HEIGHT" />
            </template>

            <template #renderPlaceholder="{ flags }">
                <PageTextFieldPlaceholder :flags="flags" is-top-aligned>Notes</PageTextFieldPlaceholder>
            </template>
        </TextArea>
    </div>
</template>
