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

const NARROW_WIDTH = 240;

type Props = TagInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div :style="{ width: `${NARROW_WIDTH}px` }">
        <TagInput
            v-model:value="value"
            ariaLabel="Crowded topics"
            :gap="FIELD_GAP"
            :padding="FIELD_PADDING"
            :min-height="FIELD_HEIGHT"
            :is-disabled="isDisabled"
            :has-error="hasError"
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
