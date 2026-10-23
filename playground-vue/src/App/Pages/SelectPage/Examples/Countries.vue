<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupBox from "../../../StyledComponents/SelectGroupContent/PageSelectGroupBox.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { SelectExampleProps } from "../SelectPage.types";
import { COUNTRIES, PLACEHOLDER } from "../SelectPageVue.const";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectExampleProps & {
    isDisabled?: boolean;
    hasError?: boolean;
    hasGroups?: boolean;
    hasGroupBoxes?: boolean;
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

        <template v-if="hasGroups" #renderGroupHeader="{ group }">
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
