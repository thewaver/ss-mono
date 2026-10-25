<script setup lang="ts">
import { h } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, MenuFlags } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPageVue.const";
import type { MenuTooltipDocsExampleProps } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuTooltipDocsExampleProps;

defineProps<Props>();

const tooltipDefs: InteractionTooltipDefs<MenuFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "Cut, copy or paste what is selected."),
};
</script>

<template>
    <Menu
        :items="ACTIONS"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
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
