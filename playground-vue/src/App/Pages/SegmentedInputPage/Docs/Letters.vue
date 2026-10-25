<script setup lang="ts">
import { shallowRef } from "vue";

import { SegmentedInput } from "@thewaver/ss-components-vue";
import { RECOVERY_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.vue";

const ALPHANUMERIC = /^[A-Za-z0-9]$/;

const value = shallowRef("");
</script>

<template>
    <SegmentedInput
        v-model:value="value"
        :cell-count="RECOVERY_CODE_LENGTH"
        :gap="FIELD_GAP"
        ariaLabel="Recovery code"
        input-mode="text"
        :compute-is-allowed="(char: string) => ALPHANUMERIC.test(char)"
    >
        <template #renderCell="cell">
            <PageSegmentedInputCell :render-props="cell" />
        </template>
    </SegmentedInput>
</template>
