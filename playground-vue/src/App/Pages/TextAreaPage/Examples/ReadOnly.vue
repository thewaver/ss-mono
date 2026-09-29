<script setup lang="ts">
import { useModel } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

type Props = TextAreaExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <TextArea
        v-model:value="value"
        is-read-only
        is-auto-sizing
        :min-rows="MIN_ROWS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Read-only notes"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" is-stretched />
        </template>
    </TextArea>
</template>
