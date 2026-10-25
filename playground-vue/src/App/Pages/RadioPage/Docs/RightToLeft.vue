<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";

const value = shallowRef<SizeValue | undefined>();
</script>

<template>
    <div dir="rtl">
        <RadioGroup v-model:value="value" ariaLabel="Size" :gap="RADIO_GROUP_GAP">
            <Radio v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value" :ariaLabel="option.label">
                <template #renderContent="flags">
                    <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
                </template>
            </Radio>
        </RadioGroup>
    </div>
</template>
