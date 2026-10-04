<script setup lang="ts">
import { shallowRef } from "vue";

import { Toolbar, Tooltip } from "@thewaver/ss-components-vue";
import type { ToolbarAction } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarExampleProps } from "../ToolbarPage.types";
import ToolbarPopup from "../ToolbarPopup.vue";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Cut" }, { value: "Copy" }, { value: "Paste" }, { value: "Undo" }];

const HINTS: Record<string, string> = {
    Cut: "Moves the selection to the clipboard",
    Copy: "Copies the selection to the clipboard",
    Paste: "Puts the clipboard where the caret is",
    Undo: "Takes back the last change",
};

const PLACEMENT = { x: "center", y: "top-out" } as const;
const OFFSET = { x: 0, y: 8 };

type Props = ToolbarExampleProps;

const props = defineProps<Props>();

const anchor = shallowRef<HTMLElement>();

const pickAnchor = (event: Event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>("button") : null;

    if (button?.querySelector("[data-hint]") && button !== anchor.value) anchor.value = button;
};

const getHint = () => HINTS[anchor.value?.querySelector("[data-hint]")?.getAttribute("data-hint") ?? ""];
</script>

<template>
    <div :class="styles.hoverWatch" @pointerover="pickAnchor" @focusin="pickAnchor">
        <Toolbar
            :actions="ACTIONS"
            :gap="gap"
            ariaLabel="Editing"
            overflow-aria-label="More editing actions"
            @activate="props.onActivate"
        >
            <template #renderAction="{ action, flags }">
                <PageButtonContent :flags="flags"
                    ><span :data-hint="action.value">{{ action.value }}</span></PageButtonContent
                >
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

        <Tooltip
            :anchor-ref="anchor"
            :placement="PLACEMENT"
            :offset="OFFSET"
            :hover-show-delay-ms="TOOLTIP_HOVER_DELAY_MS"
        >
            <template #renderContent="content">
                <PageTooltipContent
                    :visibility-target="content.visibilityTarget"
                    :transition-duration-ms="content.transitionDurationMs"
                    >{{ getHint() }}</PageTooltipContent
                >
            </template>
        </Tooltip>
    </div>
</template>
