<script setup lang="ts">
import { useModel } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Your name"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">Your name</PageTextFieldPlaceholder>
        </template>
    </TextInput>
</template>
