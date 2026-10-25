<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, TagInput } from "@thewaver/ss-components-vue";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.vue";
import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.vue";
import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.vue";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const LABEL_GAP = 5;

const value = shallowRef(STARTING_TAGS);
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Topics</PageLabelCaption>

        <TagInput
            v-model:value="value"
            :gap="FIELD_GAP"
            :padding="FIELD_PADDING"
            :min-height="FIELD_HEIGHT"
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
    </Label>
</template>
