<script setup lang="ts">
import { shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LONG_TEXT, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TextAreaGrowingDocsExampleProps } from "../TextAreaPageVue.types";

type Props = TextAreaGrowingDocsExampleProps;

defineProps<Props>();

const value = shallowRef(LONG_TEXT);
</script>

<template>
    <TextArea
        v-model:value="value"
        is-auto-sizing
        :min-rows="MIN_ROWS"
        :max-rows="maxRows"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Message"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" is-stretched />
        </template>
    </TextArea>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Length: ${value.length}` }}</div>
</template>
