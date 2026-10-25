<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER, createStressDeliveries } from "../SelectPageVue.const";
import type { SelectVirtualizedDocsExampleProps } from "../SelectPageVue.types";
import SelectPopup from "../SelectPopup.vue";

const OPTION_HEIGHT = 100;

type Props = SelectVirtualizedDocsExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const value = shallowRef<Delivery | undefined>();

const options = computed(() => createStressDeliveries(props.count));
</script>

<template>
    <Select
        v-model:value="value"
        v-model:visibility="visibility"
        :options="options"
        ariaLabel="Route"
        :compute-estimated-option-height="() => OPTION_HEIGHT"
        :compute-custom-text="(option: SelectOption<Delivery>) => option.value.name"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{ selectedOption?.value.name ?? PLACEHOLDER }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags" :description="option.value.description">{{
                option.value.name
            }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </Select>
</template>
