<script setup lang="ts">
import { useModel } from "vue";

import { Label, TextArea } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH, MAX_ROWS, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

const LABEL_GAP = 5;

type Props = TextAreaExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Bio</PageLabelCaption>

        <TextArea
            v-model:value="value"
            is-auto-sizing
            :min-rows="MIN_ROWS"
            :max-rows="MAX_ROWS"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" is-stretched />
            </template>
        </TextArea>
    </Label>
</template>
