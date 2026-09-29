<script setup lang="ts">
import { TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import { useFieldReset } from "./Field.context";
import type { PageTextFieldProps } from "./Field.types";

const props = defineProps<PageTextFieldProps>();

useFieldReset(props.value, (value) => props.onInput(value));
</script>

<template>
    <TextInput
        :value="value"
        :is-disabled="isDisabled"
        :ariaLabel="ariaLabel"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        @update:value="props.onInput"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="width" />
        </template>

        <template v-if="placeholder !== undefined" #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">{{ placeholder }}</PageTextFieldPlaceholder>
        </template>
    </TextInput>
</template>
