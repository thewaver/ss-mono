<script setup lang="ts">
import { useModel } from "vue";

import { MultiSelect } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";
import type { MultiSelectClearableExampleProps } from "../MultiSelectPage.types";

type Props = MultiSelectClearableExampleProps;

const props = defineProps<Props>();

const values = useModel(props, "values");
</script>

<template>
    <MultiSelect
        v-model:values="values"
        :options="COUNTRIES"
        ariaLabel="Countries"
        clearAriaLabel="Clear countries"
        :padding="QUERY_PADDING"
        @selection-change="props.onSelectionChange"
    >
        <template #renderContent="{ selectedOptions, flags }">
            <PageSelectContent :flags="flags" has-clear-space>{{
                selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderClear="flags">
            <PageSelectClear :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </MultiSelect>
</template>
