<script setup lang="ts">
import { useModel } from "vue";

import { Label, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TextInputExampleProps } from "../TextInputPage.types";

const LABEL_GAP = 5;

type Props = TextInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Display name</PageLabelCaption>

        <TextInput
            v-model:value="value"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" />
            </template>
        </TextInput>
    </Label>
</template>
