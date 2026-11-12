<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import PageIcon from "../../StyledComponents/Icon/Icon.vue";
import PageTextFieldAdornment from "../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldButtonContent from "../../StyledComponents/TextFieldButtonContent/TextFieldButtonContent.vue";
import PageTextFieldContent from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { SkinStateProps } from "./AppearancePage.types";

const props = withDefaults(defineProps<SkinStateProps>(), {
    isReadOnly: undefined,
    isDisabled: undefined,
    hasError: undefined,
});

const value = shallowRef(props.state);
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :is-read-only="isReadOnly"
        :is-disabled="isDisabled"
        :has-error="hasError"
        :ariaLabel="state"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderLeading="flags">
            <PageTextFieldAdornment :flags="flags"><PageIcon :src="person" /></PageTextFieldAdornment>
        </template>

        <template #renderTrailing>
            <Button :is-disabled="isDisabled">
                <template #renderContent="flags">
                    <PageTextFieldButtonContent :flags="flags">Clear</PageTextFieldButtonContent>
                </template>
            </Button>
        </template>
    </TextInput>
</template>
