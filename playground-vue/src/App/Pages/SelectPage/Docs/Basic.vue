<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../SelectPageVue.const";
import type { SelectBasicDocsExampleProps } from "../SelectPageVue.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<string | undefined>();
</script>

<template>
    <Select
        v-model:value="value"
        :options="COUNTRIES"
        :has-error="hasError"
        :is-disabled="isDisabled"
        ariaLabel="Country"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value ?? PLACEHOLDER }}</PageSelectContent>
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
    </Select>
</template>
