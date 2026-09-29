<script setup lang="ts">
import { useModel } from "vue";

import { FormField } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import type { FormFieldExampleProps } from "../FormFieldPage.types";
import ForeignInput from "./ForeignInput.vue";

type Props = FormFieldExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div :class="styles.fieldBox">
        <FormField :orientation="orientation" :gap="gap" :has-error="hasError" :message="message">
            <template #renderCaption>
                <PageFormFieldCaption>Display name</PageFormFieldCaption>
            </template>

            <template #renderMessage="state">
                <PageFormFieldMessage :state="state">{{ message }}</PageFormFieldMessage>
            </template>

            <template #renderControl>
                <ForeignInput v-model:value="value" />
            </template>
        </FormField>
    </div>
</template>
