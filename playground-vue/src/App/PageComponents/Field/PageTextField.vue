<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef } from "vue";

import { Button, TextInput } from "@thewaver/ss-components-vue";
import { EMPTY_TEXT } from "@thewaver/ss-playground/App/PageComponents/Field/Field.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageSelectClear from "../../StyledComponents/SelectClear/SelectClear.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import { useFieldReset } from "./FieldVue.context";
import type { PageTextFieldProps } from "./FieldVue.types";

const props = defineProps<PageTextFieldProps>();

const fieldRef = shallowRef<ComponentPublicInstance>();

useFieldReset(props.value, (value) => props.onInput(value));

const clear = () => {
    props.onInput(EMPTY_TEXT);
    (fieldRef.value?.$el as HTMLElement | undefined)?.focus();
};
</script>

<template>
    <TextInput
        ref="fieldRef"
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

        <template v-if="clearAriaLabel !== undefined" #renderTrailing>
            <Button v-if="value !== EMPTY_TEXT" :ariaLabel="clearAriaLabel" @click="clear">
                <template #renderContent="flags">
                    <PageSelectClear :flags="flags" />
                </template>
            </Button>
        </template>
    </TextInput>
</template>
