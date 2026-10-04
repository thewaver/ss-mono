<script setup lang="ts">
import { h } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, MenuFlags } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPage.const";
import MenuPopup from "../MenuPopup.vue";

const tooltipDefs: InteractionTooltipDefs<MenuFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Nothing is selected, so there is nothing to edit.",
        ),
};
</script>

<template>
    <Menu
        :items="ACTIONS"
        is-disabled
        is-reachable-when-disabled
        ariaLabel="Edit actions"
        :tooltip-defs="tooltipDefs"
        @activate="() => undefined"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
