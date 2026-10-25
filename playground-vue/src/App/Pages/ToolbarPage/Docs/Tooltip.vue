<script setup lang="ts">
import { computed, h, shallowRef } from "vue";

import { SharedTooltip, Toolbar } from "@thewaver/ss-components-vue";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarTooltipDocsExampleProps } from "../ToolbarPageVue.types";
import ToolbarPopup from "../ToolbarPopup.vue";
import ResizableBar from "./ResizableBar.vue";

const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

const OFFSET = { x: 0, y: 8 };

const toHint = (text: string): InteractionTooltipDefs => ({
    placement: PLACEMENT,
    offset: OFFSET,
    hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => text),
});

type Props = ToolbarTooltipDocsExampleProps;

const props = defineProps<Props>();

const lastRun = shallowRef<string>();

const actions = computed((): ToolbarAction<string>[] => [
    { value: "Cut", tooltipDefs: toHint("Moves the selection to the clipboard") },
    { value: "Copy", tooltipDefs: toHint("Copies the selection to the clipboard") },
    {
        value: "Clear",
        isDisabled: props.isDisabled,
        isReachableWhenDisabled: props.isReachableWhenDisabled,
        tooltipDefs: toHint(
            props.isDisabled ? "Nothing is selected, so there is nothing to clear" : "Deletes the selection",
        ),
    },
    { value: "Paste", tooltipDefs: toHint("Puts the clipboard where the caret is") },
    { value: "Undo", tooltipDefs: toHint("Takes back the last change") },
]);
</script>

<template>
    <ResizableBar>
        <SharedTooltip>
            <Toolbar
                :actions="actions"
                ariaLabel="Editing"
                overflowAriaLabel="More editing actions"
                @activate="(value: string) => (lastRun = value)"
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
    </ResizableBar>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun ?? "nothing yet"}` }}</div>
</template>
