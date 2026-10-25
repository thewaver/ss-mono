<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES_WITH_DISABLED, COUNTRIES_WITH_REACHABLE, PLACEHOLDER } from "../SelectPageVue.const";
import type { SelectDisabledOptionsDocsExampleProps } from "../SelectPageVue.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectDisabledOptionsDocsExampleProps;

defineProps<Props>();

const value = shallowRef<string | undefined>();
</script>

<template>
    <Select
        v-model:value="value"
        :options="isReachable ? COUNTRIES_WITH_REACHABLE : COUNTRIES_WITH_DISABLED"
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
