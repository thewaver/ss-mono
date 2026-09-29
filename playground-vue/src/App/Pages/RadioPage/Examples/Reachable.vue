<script setup lang="ts">
import { h, useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioExampleProps } from "../RadioPage.types";

const REACHABLE_VALUE = "medium";

type Props = RadioExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                "Arrow keys still land here so this tooltip can be read, but they must not select it and clicking must leave the value alone.",
        ),
};
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Partly disabled size" :gap="RADIO_GROUP_GAP">
        <Radio
            v-for="option in SIZE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :ariaLabel="option.label"
            :is-disabled="option.value === REACHABLE_VALUE"
            :is-reachable-when-disabled="option.value === REACHABLE_VALUE"
            :tooltip-defs="option.value === REACHABLE_VALUE ? tooltipDefs : undefined"
        >
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>
        </Radio>
    </RadioGroup>
</template>
