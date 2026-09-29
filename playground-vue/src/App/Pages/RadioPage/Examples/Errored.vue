<script setup lang="ts">
import { computed, useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioOptionalExampleProps } from "../RadioPage.types";

type Props = RadioOptionalExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const hasError = computed(() => value.value === undefined);
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Required size" :gap="RADIO_GROUP_GAP" :has-error="hasError">
        <Radio
            v-for="option in SIZE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :ariaLabel="option.label"
            :has-error="hasError"
        >
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
