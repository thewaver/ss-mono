<script setup lang="ts">
import { shallowRef } from "vue";

import { TagInput } from "@thewaver/ss-components-vue";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CROWDED_TAGS, NARROW_WIDTH } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.vue";
import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.vue";
import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.vue";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const value = shallowRef(CROWDED_TAGS);
</script>

<template>
    <div :style="{ width: `${NARROW_WIDTH}px` }">
        <TagInput
            v-model:value="value"
            ariaLabel="Crowded topics"
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
    </div>
</template>
