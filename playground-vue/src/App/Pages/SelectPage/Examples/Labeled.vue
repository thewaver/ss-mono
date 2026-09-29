<script setup lang="ts">
import { useModel } from "vue";

import { Label, Select } from "@thewaver/ss-components-vue";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

const LABEL_GAP = 5;

type Props = SelectExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Country</PageLabelCaption>

        <Select v-model:value="value" :options="COUNTRIES" list-aria-label="Country">
            <template #renderContent="{ selectedOption, flags }">
                <PageSelectContent :flags="flags">{{ selectedOption?.value ?? PLACEHOLDER }}</PageSelectContent>
            </template>

            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderPopup="popup">
                <SelectPopup v-bind="popup" />
            </template>
        </Select>
    </Label>
</template>
