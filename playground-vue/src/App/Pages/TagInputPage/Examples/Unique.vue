<script setup lang="ts">
import { useModel } from "vue";

import { TagInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.vue";
import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.vue";
import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.vue";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TagInputExampleProps } from "../TagInputPage.types";

type Props = TagInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const computeTag = (text: string) => {
    const tag = text.trim().toLowerCase();

    return tag && !value.value.includes(tag) ? tag : undefined;
};
</script>

<template>
    <TagInput
        v-model:value="value"
        ariaLabel="Unique topics"
        :gap="FIELD_GAP"
        :padding="FIELD_PADDING"
        :min-height="FIELD_HEIGHT"
        :is-disabled="isDisabled"
        :has-error="hasError"
        :compute-text-style="computePageTextFieldTextStyle"
        :compute-tag="computeTag"
    >
        <template #renderContent="flags">
            <PageTagInputContent :flags="flags" />
        </template>

        <template #renderPlaceholder>
            <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>
        </template>

        <template #renderTag="{ tag, flags }">
            <PageTagContent :flags="flags">{{ tag }}</PageTagContent>
        </template>
    </TagInput>
</template>
