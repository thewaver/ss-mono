<script setup lang="ts">
import { useModel } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { City, TextInputCitiesExampleProps } from "../TextInputPage.types";

type Props = TextInputCitiesExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const computeCitySuggestionText = (city: City) => city.name;
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="City"
        :suggestions="suggestions"
        suggestions-aria-label="Cities"
        :compute-custom-suggestion-text="computeCitySuggestionText"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">Any city</PageTextFieldPlaceholder>
        </template>

        <template #renderSuggestion="{ suggestion, flags }">
            <PageSelectOptionContent :flags="flags" :description="suggestion.country">{{
                suggestion.name
            }}</PageSelectOptionContent>
        </template>

        <template #renderSuggestionPopup="{ renderSuggestions, visibilityTarget, transitionDurationMs, placement }">
            <PagePopoverSurface
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                :placement="placement"
            >
                <component :is="renderSuggestions" />
            </PagePopoverSurface>
        </template>
    </TextInput>
</template>
