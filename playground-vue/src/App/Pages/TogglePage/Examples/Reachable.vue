<script setup lang="ts">
import { h, useModel } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but clicking and pressing Space must leave it on.",
        ),
};
</script>

<template>
    <Toggle
        v-model:checked="checked"
        ariaLabel="Disabled but reachable toggle"
        is-disabled
        is-reachable-when-disabled
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageToggleContent :flags="flags" />
        </template>
    </Toggle>
</template>
