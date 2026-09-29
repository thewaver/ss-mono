<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { DELIVERIES, PLACEHOLDER } from "../SelectPage.const";
import type { SelectDeliveryExampleProps } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectDeliveryExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Select v-model:value="value" :options="DELIVERIES" ariaLabel="Delivery">
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value.name ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags" :description="option.value.description">{{
                option.value.name
            }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </Select>
</template>
