<script setup lang="ts">
import { useModel } from "vue";

import { MultiSelect } from "@thewaver/ss-components-vue";

import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../../SelectPage/SelectPage.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";

type Props = {
    "values": string[];
    "onUpdate:values"?: (values: string[]) => void;
};

const props = defineProps<Props>();

const values = useModel(props, "values");
</script>

<template>
    <MultiSelect v-model:values="values" :options="COUNTRIES" ariaLabel="Countries">
        <template #renderContent="{ selectedOptions, flags }">
            <PageSelectContent :flags="flags">{{
                selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </MultiSelect>
</template>
