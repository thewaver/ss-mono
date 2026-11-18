<script setup lang="ts">
import { shallowRef } from "vue";

import { FormField } from "@thewaver/ss-components-vue";
import { MESSAGE } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import ForeignInput from "./ForeignInput.vue";

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
