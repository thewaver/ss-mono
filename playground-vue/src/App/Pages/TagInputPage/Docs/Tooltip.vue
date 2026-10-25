<script setup lang="ts">
import { h, shallowRef } from "vue";

import { TagInput } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, TagInputFlags } from "@thewaver/ss-components-vue";
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
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { TagInputTooltipDocsExampleProps } from "../TagInputPageVue.types";

type Props = TagInputTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef(STARTING_TAGS);

const tooltipDefs: InteractionTooltipDefs<TagInputFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but no tag may be added or removed.",
        ),
};
</script>

<template>
    <TagInput
        v-model:value="value"
        ariaLabel="Disabled but reachable topics"
        :gap="FIELD_GAP"
        :padding="FIELD_PADDING"
        :min-height="FIELD_HEIGHT"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :compute-tag-aria-label="computeTagAriaLabel"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
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
