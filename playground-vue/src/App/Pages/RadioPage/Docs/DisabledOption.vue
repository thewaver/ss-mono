<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { RadioDisabledOptionDocsExampleProps } from "../RadioPageVue.types";

const DISABLED_VALUE: SizeValue = "medium";

type Props = RadioDisabledOptionDocsExampleProps;

defineProps<Props>();

const value = shallowRef<SizeValue>("small");

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "Out of stock in this size."),
};
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Size" :gap="RADIO_GROUP_GAP">
        <Radio
            v-for="option in SIZE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :ariaLabel="option.label"
            :is-disabled="option.value === DISABLED_VALUE"
            :is-reachable-when-disabled="isReachableWhenDisabled"
            :tooltip-defs="option.value === DISABLED_VALUE ? tooltipDefs : undefined"
        >
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
