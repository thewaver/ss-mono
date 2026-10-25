<script setup lang="ts">
import { shallowRef } from "vue";

import { FormField } from "@thewaver/ss-components-vue";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import ForeignInput from "./ForeignInput.vue";

const MESSAGE = "Shown to everyone who can see your posts.";

const value = shallowRef("");
</script>

<template>
    <FormField :message="MESSAGE">
        <template #renderCaption>
            <PageFormFieldCaption>Display name</PageFormFieldCaption>
        </template>

        <template #renderMessage="state">
            <PageFormFieldMessage :state="state">{{ MESSAGE }}</PageFormFieldMessage>
        </template>

        <template #renderControl>
            <ForeignInput v-model:value="value" />
        </template>
    </FormField>
</template>
