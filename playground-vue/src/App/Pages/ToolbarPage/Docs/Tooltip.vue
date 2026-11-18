<script setup lang="ts">
import { computed, h, shallowRef } from "vue";

import { SharedTooltip, Toolbar } from "@thewaver/ss-components-vue";
import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    COPIES_SELECTION_CLIPBOARD_TEXT,
    DELETES_SELECTION_TEXT,
    MORE_EDITING_ACTIONS_LABEL,
    MOVES_SELECTION_CLIPBOARD_TEXT,
    NOTHING_SELECTED_SO_THERE_TEXT,
    PUTS_CLIPBOARD_WHERE_CARET_TEXT,
    TAKES_BACK_LAST_CHANGE_TEXT,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
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
    renderContent: ({ visibilityTarget, transitionDurationMs, arrowAim }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs, arrowAim }, () => text),
});

type Props = ToolbarTooltipDocsExampleProps;

const props = defineProps<Props>();

const lastRun = shallowRef<string>();

const actions = computed((): ToolbarAction<string>[] => [
    { value: "Cut", tooltipDefs: toHint(MOVES_SELECTION_CLIPBOARD_TEXT) },
    { value: "Copy", tooltipDefs: toHint(COPIES_SELECTION_CLIPBOARD_TEXT) },
    {
        value: "Clear",
        isDisabled: props.isDisabled,
        isReachableWhenDisabled: props.isReachableWhenDisabled,
        tooltipDefs: toHint(props.isDisabled ? NOTHING_SELECTED_SO_THERE_TEXT : DELETES_SELECTION_TEXT),
    },
    { value: "Paste", tooltipDefs: toHint(PUTS_CLIPBOARD_WHERE_CARET_TEXT) },
    { value: "Undo", tooltipDefs: toHint(TAKES_BACK_LAST_CHANGE_TEXT) },
]);
</script>

<template>
    <ResizableBar>
        <SharedTooltip>
            <Toolbar
                :actions="actions"
                ariaLabel="Editing"
                :overflowAriaLabel="MORE_EDITING_ACTIONS_LABEL"
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
