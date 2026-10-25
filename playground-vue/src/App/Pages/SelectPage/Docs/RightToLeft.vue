<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../SelectPageVue.const";
import SelectPopup from "../SelectPopup.vue";

const value = shallowRef<string | undefined>("Estonia");
</script>

<template>
    <div dir="rtl">
        <Select
            v-model:value="value"
            :options="COUNTRIES"
            ariaLabel="Country"
            clearAriaLabel="Clear country"
            :padding="QUERY_PADDING"
        >
            <template #renderContent="{ selectedOption, flags }">
                <PageSelectContent :flags="flags" has-clear-space>{{
                    selectedOption?.value ?? PLACEHOLDER
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
        </Select>
    </div>
</template>
