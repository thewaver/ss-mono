<script setup lang="ts">
import { useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import type { RadioExampleProps } from "../RadioPageVue.types";

type Props = RadioExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Disabled size" :gap="RADIO_GROUP_GAP">
        <Radio
            v-for="option in SIZE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :ariaLabel="option.label"
            is-disabled
        >
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
