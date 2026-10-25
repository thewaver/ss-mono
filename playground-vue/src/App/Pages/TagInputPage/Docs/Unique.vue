<script setup lang="ts">
import { shallowRef } from "vue";

import { TagInput } from "@thewaver/ss-components-vue";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.vue";
import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.vue";
import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.vue";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const value = shallowRef(STARTING_TAGS);

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
        :compute-tag="computeTag"
        :compute-tag-aria-label="computeTagAriaLabel"
        :compute-text-style="computePageTextFieldTextStyle"
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
