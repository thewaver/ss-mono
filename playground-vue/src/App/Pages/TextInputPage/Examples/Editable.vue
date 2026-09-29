<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, useModel, watch } from "vue";

import { Button, TextInput, toElement } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageInlineEditContent from "../../../StyledComponents/InlineEditContent/InlineEditContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TextInputEditableExampleProps } from "../TextInputPage.types";

type Props = TextInputEditableExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const editing = useModel(props, "editing");

const draft = shallowRef("");
const buttonRef = shallowRef<HTMLElement>();
const inputRef = shallowRef<HTMLElement>();

let isEditingNow = editing.value;

const setButtonRef = (target: Element | ComponentPublicInstance | null) => {
    buttonRef.value = toElement(target);
};

const setInputRef = (target: Element | ComponentPublicInstance | null) => {
    inputRef.value = toElement(target);
};

const startEditing = () => {
    draft.value = value.value;
    isEditingNow = true;
    editing.value = true;
};

const finishEditing = (isCommitting: boolean) => {
    if (!isEditingNow) return;

    isEditingNow = false;

    if (isCommitting) value.value = draft.value;

    editing.value = false;
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        e.preventDefault();
        finishEditing(true);
    }

    if (e.key === "Escape") {
        e.preventDefault();
        finishEditing(false);
    }
};

watch(
    editing,
    (isEditing) => {
        isEditingNow = isEditing;

        (isEditing ? inputRef : buttonRef).value?.focus();
    },
    { flush: "post" },
);
</script>

<template>
    <Button v-if="!editing" :ref="setButtonRef" :ariaLabel="`Edit name, ${value}`" @click="startEditing">
        <template #renderContent="flags">
            <PageInlineEditContent :flags="flags">{{ value }}</PageInlineEditContent>
        </template>
    </Button>

    <div v-else @keydown="handleKeyDown" @focusout="finishEditing(true)">
        <TextInput
            :ref="setInputRef"
            v-model:value="draft"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            ariaLabel="Name"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" />
            </template>
        </TextInput>
    </div>
</template>
