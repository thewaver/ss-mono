<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import { NOTHING_CHOSEN } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuDestinationItem from "../MenuDestinationItem.vue";
import { DESTINATIONS } from "../MenuPageVue.const";
import type { Destination } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const PATH_SEPARATOR = " / ";
const path = shallowRef<string[]>([]);

const pathText = computed(() => (path.value.length > 0 ? path.value.join(PATH_SEPARATOR) : NOTHING_CHOSEN));
</script>

<template>
    <Menu
        :items="DESTINATIONS"
        :ariaLabel="`Destination: ${pathText}`"
        :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
        @activate="(destination: Destination) => (path = destination.path)"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">{{ pathText }}</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuDestinationItem :item="item" :flags="flags" />
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
