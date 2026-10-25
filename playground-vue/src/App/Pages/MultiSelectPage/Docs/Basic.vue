<script setup lang="ts">
import { shallowRef } from "vue";

import { MultiSelect } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../../SelectPage/SelectPageVue.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";
import type { MultiSelectBasicDocsExampleProps } from "../MultiSelectPageVue.types";

type Props = MultiSelectBasicDocsExampleProps;

defineProps<Props>();

const values = shallowRef<string[]>(["Denmark"]);
</script>

<template>
    <MultiSelect
        v-model:values="values"
        :options="COUNTRIES"
        :has-error="hasError"
        :is-disabled="isDisabled"
        ariaLabel="Countries"
    >
        <template #renderContent="{ selectedOptions, flags }">
            <PageSelectContent :flags="flags">{{
                selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </MultiSelect>
</template>
