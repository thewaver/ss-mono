<script setup lang="ts">
import { useModel } from "vue";

import { CurrencyInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { CurrencyInputExampleProps } from "../CurrencyInputPage.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputExampleProps & { ariaLabel?: string };

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <CurrencyInput
        v-model:value="value"
        :ariaLabel="ariaLabel ?? 'Price'"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :locale="locale"
        :decimals="decimals"
        :group-sizes="groupSizes"
        :has-sign="hasSign"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>
    </CurrencyInput>
</template>
