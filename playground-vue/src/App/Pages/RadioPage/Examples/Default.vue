<script setup lang="ts">
import { useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioOptionalExampleProps } from "../RadioPage.types";

type Props = RadioOptionalExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Default size" :gap="RADIO_GROUP_GAP">
        <Radio v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value" :ariaLabel="option.label">
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
