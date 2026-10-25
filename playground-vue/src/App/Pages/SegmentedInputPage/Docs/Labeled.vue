<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, SegmentedInput } from "@thewaver/ss-components-vue";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.vue";

const LABEL_GAP = 5;

const value = shallowRef("");
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Verification code</PageLabelCaption>

        <SegmentedInput
            v-model:value="value"
            :cell-count="ONE_TIME_CODE_LENGTH"
            :gap="FIELD_GAP"
            auto-complete="one-time-code"
        >
            <template #renderCell="cell">
                <PageSegmentedInputCell :render-props="cell" />
            </template>
        </SegmentedInput>
    </Label>
</template>
