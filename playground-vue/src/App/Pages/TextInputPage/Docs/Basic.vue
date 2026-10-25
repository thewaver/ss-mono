<script setup lang="ts">
import { shallowRef } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { TextInputBasicDocsExampleProps } from "../TextInputPageVue.types";

type Props = TextInputBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef("");
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :is-read-only="isReadOnly"
        :has-error="hasError"
        :is-disabled="isDisabled"
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
