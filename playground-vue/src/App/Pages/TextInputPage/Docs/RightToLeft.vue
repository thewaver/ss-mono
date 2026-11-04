<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import PageIcon from "../../../StyledComponents/Icon/Icon.vue";
import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldButtonContent from "../../../StyledComponents/TextFieldButtonContent/TextFieldButtonContent.vue";
import PageTextFieldContent from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const value = shallowRef("");

const clear = () => {
    value.value = "";
};
</script>

<template>
    <div dir="rtl">
        <TextInput
            v-model:value="value"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            ariaLabel="Username"
            auto-complete="username"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" />
            </template>

            <template #renderPlaceholder="{ flags }">
                <PageTextFieldPlaceholder :flags="flags">Username</PageTextFieldPlaceholder>
            </template>

            <template #renderLeading="flags">
                <PageTextFieldAdornment :flags="flags"><PageIcon :src="person" /></PageTextFieldAdornment>
            </template>

            <template #renderTrailing>
                <Button :is-disabled="value === ''" @click="clear">
                    <template #renderContent="flags">
                        <PageTextFieldButtonContent :flags="flags">Clear</PageTextFieldButtonContent>
                    </template>
                </Button>
            </template>
        </TextInput>
    </div>
</template>
