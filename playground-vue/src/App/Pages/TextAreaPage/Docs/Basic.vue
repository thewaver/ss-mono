<script setup lang="ts">
import { shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { TextAreaBasicDocsExampleProps } from "../TextAreaPageVue.types";

type Props = TextAreaBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef("");
</script>

<template>
    <TextArea
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :is-read-only="isReadOnly"
        :has-error="hasError"
        :is-disabled="isDisabled"
        ariaLabel="Notes"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" :height="FIXED_HEIGHT" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags" is-top-aligned>Notes</PageTextFieldPlaceholder>
        </template>
    </TextArea>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Length: ${value.length}` }}</div>
</template>
