<script setup lang="ts">
import { shallowRef } from "vue";

import { TagInput } from "@thewaver/ss-components-vue";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { SKIN_SAMPLE_TAGS } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTagContent from "../../StyledComponents/TagInputContent/PageTagContent.vue";
import PageTagInputContent from "../../StyledComponents/TagInputContent/PageTagInputContent.vue";
import PageTagInputPlaceholder from "../../StyledComponents/TagInputContent/PageTagInputPlaceholder.vue";
import type { SkinStateProps } from "./AppearancePage.types";

withDefaults(defineProps<SkinStateProps>(), { isDisabled: undefined, hasError: undefined });

const value = shallowRef(SKIN_SAMPLE_TAGS);
</script>

<template>
    <TagInput
        v-model:value="value"
        :ariaLabel="state"
        :gap="FIELD_GAP"
        :padding="FIELD_PADDING"
        :min-height="FIELD_HEIGHT"
        :is-disabled="isDisabled"
        :has-error="hasError"
        :compute-tag-aria-label="computeTagAriaLabel"
    >
        <template #renderContent="flags">
            <PageTagInputContent :flags="flags" />
        </template>

        <template #renderPlaceholder>
            <PageTagInputPlaceholder>{{ state }}</PageTagInputPlaceholder>
        </template>

        <template #renderTag="{ tag, flags }">
            <PageTagContent :flags="flags">{{ tag }}</PageTagContent>
        </template>
    </TagInput>
</template>
