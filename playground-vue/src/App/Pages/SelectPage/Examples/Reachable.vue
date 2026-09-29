<script setup lang="ts">
import { h, useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, SelectFlags } from "@thewaver/ss-components-vue";

import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const tooltipDefs: InteractionTooltipDefs<SelectFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this can be read, but the list must not open.",
        ),
};
</script>

<template>
    <Select
        v-model:value="value"
        :options="COUNTRIES"
        is-disabled
        is-reachable-when-disabled
        ariaLabel="Country"
        :tooltip-defs="tooltipDefs"
    >
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
</template>
