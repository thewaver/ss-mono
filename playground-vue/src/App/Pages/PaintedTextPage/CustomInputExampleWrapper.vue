<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import CustomInputExample from "./Examples/CustomInput.vue";
import type { PaintedTextExampleProps, PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

const props = defineProps<PaintedTextExampleWrapperProps>();

const text = shallowRef(PaintedTextKnobs.STARTING_CUSTOM_TEXT);

const exampleProps = computed((): PaintedTextExampleProps => {
    const { width: _width, ...rest } = props;

    return rest;
});
</script>

<template>
    <TextArea
        v-model:value="text"
        is-auto-sizing
        :min-rows="PaintedTextKnobs.CUSTOM_TEXT_MIN_ROWS"
        :max-rows="PaintedTextKnobs.CUSTOM_TEXT_MAX_ROWS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Custom text"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="PaintedTextKnobs.CUSTOM_TEXT_WIDTH" is-stretched />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags" is-top-aligned>Put custom text inside me</PageTextFieldPlaceholder>
        </template>
    </TextArea>

    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <CustomInputExample v-bind="exampleProps" :text="text" />
    </PageMeasureBox>
</template>
