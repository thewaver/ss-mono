<script setup lang="ts">
import { useModel } from "vue";

import { SegmentedInput } from "@thewaver/ss-components-vue";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.vue";
import type { SegmentedInputExampleProps } from "../SegmentedInputPage.types";

type Props = SegmentedInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <SegmentedInput
        v-model:value="value"
        :cell-count="ONE_TIME_CODE_LENGTH"
        :gap="FIELD_GAP"
        ariaLabel="One-time code"
        auto-complete="one-time-code"
    >
        <template #renderCell="cell">
            <PageSegmentedInputCell :render-props="cell" />
        </template>
    </SegmentedInput>
</template>
