<script setup lang="ts">
import { Menu } from "@thewaver/ss-components-vue";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { NESTED_ACTIONS } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Menu
        :items="NESTED_ACTIONS"
        ariaLabel="File actions"
        :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
        @activate="props.onActivate"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">File</PageMenuTriggerContent>
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
