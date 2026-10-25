<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const value = shallowRef("");
const reveal = shallowRef(false);

const toggleReveal = () => {
    reveal.value = !reveal.value;
};
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :type="reveal ? 'text' : 'password'"
        ariaLabel="Password"
        auto-complete="current-password"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">Password</PageTextFieldPlaceholder>
        </template>

        <template #renderTrailing>
            <Button @click="toggleReveal">
                <template #renderContent="flags">
                    <PageTextFieldAdornment :flags="flags">{{ reveal ? "Hide" : "Show" }}</PageTextFieldAdornment>
                </template>
            </Button>
        </template>
    </TextInput>
</template>
