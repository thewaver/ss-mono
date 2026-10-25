<script setup lang="ts">
import { shallowRef } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const value = shallowRef("");
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Coupon code"
        :compute-text-style="computePageTextFieldTextStyle"
        @input="(next: string) => (value = next.toLocaleUpperCase())"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">Coupon code (upper-cased)</PageTextFieldPlaceholder>
        </template>
    </TextInput>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: "${value}"` }}</div>
</template>
