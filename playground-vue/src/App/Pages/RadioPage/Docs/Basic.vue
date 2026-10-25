<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import type { RadioBasicDocsExampleProps } from "../RadioPageVue.types";

type Props = RadioBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<SizeValue | undefined>();
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Size" :gap="RADIO_GROUP_GAP" :has-error="hasError">
        <Radio
            v-for="option in SIZE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :ariaLabel="option.label"
            :has-error="hasError"
            :is-disabled="isDisabled"
        >
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
