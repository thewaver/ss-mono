<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectExampleProps & {
    isDisabled?: boolean;
    hasError?: boolean;
    hasGroups?: boolean;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Select
        v-model:value="value"
        :options="options ?? COUNTRIES"
        :is-disabled="isDisabled"
        :has-error="hasError"
        ariaLabel="Country"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template v-if="hasGroups" #renderGroup="{ group }">
            <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </Select>
</template>
