<script setup lang="ts">
import { Toolbar } from "@thewaver/ss-components-vue";
import type { ToolbarAction } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarExampleProps } from "../ToolbarPage.types";
import ToolbarPopup from "../ToolbarPopup.vue";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Undo" },
    { value: "Redo" },
    { value: "Comment" },
    { value: "Share", collapse: "never" },
    { value: "Print", collapse: "always" },
    { value: "Archive" },
    { value: "Rename", isDisabled: true },
];

type Props = ToolbarExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Toolbar
        :actions="ACTIONS"
        :gap="gap"
        ariaLabel="Document"
        overflow-aria-label="More document actions"
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
</template>
