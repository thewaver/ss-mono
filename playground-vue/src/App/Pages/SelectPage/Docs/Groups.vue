<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupBox from "../../../StyledComponents/SelectGroupContent/PageSelectGroupBox.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { GROUPED_COUNTRIES, PLACEHOLDER } from "../SelectPageVue.const";
import type { SelectGroupsDocsExampleProps } from "../SelectPageVue.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectGroupsDocsExampleProps;

defineProps<Props>();

const value = shallowRef<string | undefined>();
</script>

<template>
    <Select v-model:value="value" :options="GROUPED_COUNTRIES" ariaLabel="Country">
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderGroupHeader="{ group }">
            <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
        </template>

        <template v-if="hasGroupBoxes" #renderGroupBox="{ renderContent }">
            <PageSelectGroupBox><component :is="renderContent" /></PageSelectGroupBox>
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
