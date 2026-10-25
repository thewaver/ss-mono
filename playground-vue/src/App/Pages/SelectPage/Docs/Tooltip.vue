<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, SelectFlags } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import { COUNTRIES, PLACEHOLDER } from "../SelectPageVue.const";
import type { SelectTooltipDocsExampleProps } from "../SelectPageVue.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef<string | undefined>("Sweden");

const tooltipDefs: InteractionTooltipDefs<SelectFlags> = {
    placement: { x: "center", y: "top_out" },
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
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Country"
        :tooltip-defs="tooltipDefs"
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
