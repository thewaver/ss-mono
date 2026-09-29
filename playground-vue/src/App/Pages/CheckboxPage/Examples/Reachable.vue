<script setup lang="ts">
import { h, useModel } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    hoverShowDelayMs: 0,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but clicking and pressing Space must leave it checked.",
        ),
};
</script>

<template>
    <Checkbox
        v-model:checked="checked"
        ariaLabel="Disabled but reachable checkbox"
        is-disabled
        is-reachable-when-disabled
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags" />
        </template>
    </Checkbox>
</template>
