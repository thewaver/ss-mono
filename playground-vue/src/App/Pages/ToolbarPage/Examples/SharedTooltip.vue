<script setup lang="ts">
import { h } from "vue";

import { SharedTooltip, Toolbar } from "@thewaver/ss-components-vue";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-vue";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarExampleProps } from "../ToolbarPageVue.types";
import ToolbarPopup from "../ToolbarPopup.vue";

const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

const OFFSET = { x: 0, y: 8 };

const toHint = (text: string): InteractionTooltipDefs => ({
    placement: PLACEMENT,
    offset: OFFSET,
    hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => text),
});

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Cut", tooltipDefs: toHint("Moves the selection to the clipboard") },
    { value: "Copy", tooltipDefs: toHint("Copies the selection to the clipboard") },
    { value: "Clear", isDisabled: true },
    { value: "Paste", tooltipDefs: toHint("Puts the clipboard where the caret is") },
    { value: "Undo", tooltipDefs: toHint("Takes back the last change") },
];

type Props = ToolbarExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <SharedTooltip>
        <Toolbar
            :actions="ACTIONS"
            :gap="gap"
            ariaLabel="Editing"
            overflow-aria-label="More editing actions"
            @activate="props.onActivate"
        >
            <template #renderAction="{ action, flags }">
                <PageButtonContent :flags="flags">{{ action.value }}</PageButtonContent>
            </template>

            <template #renderOverflowTrigger="flags">
                <PageMenuTriggerContent :flags="flags">More</PageMenuTriggerContent>
            </template>

            <template #renderOverflowItem="{ item, flags }">
                <ToolbarOverflowItem :item="item" :flags="flags" />
            </template>

            <template #renderOverflowPopup="{ renderItems, visibilityTarget, transitionDurationMs, placement }">
                <ToolbarPopup
                    :render-items="renderItems"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :placement="placement"
                />
            </template>
        </Toolbar>
    </SharedTooltip>
</template>
