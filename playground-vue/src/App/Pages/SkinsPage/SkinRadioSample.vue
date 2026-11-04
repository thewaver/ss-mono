<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.vue";
import type { SkinStateProps } from "./SkinsPage.types";

const props = withDefaults(defineProps<SkinStateProps>(), {
    isChecked: undefined,
    isDisabled: undefined,
    hasError: undefined,
});

const value = shallowRef(props.isChecked ? props.state : undefined);
</script>

<template>
    <RadioGroup v-model:value="value" :ariaLabel="state" :gap="RADIO_GROUP_GAP" :has-error="hasError">
        <Radio :value="state" :ariaLabel="state" :is-disabled="isDisabled" :has-error="hasError">
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ state }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
