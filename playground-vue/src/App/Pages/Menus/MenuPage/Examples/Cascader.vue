<script setup lang="ts">
import { computed, useModel } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuDestinationItem from "../MenuDestinationItem.vue";
import { DESTINATIONS } from "../MenuPage.const";
import type { Destination, MenuCascaderExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

const PATH_SEPARATOR = " / ";
const NOTHING_CHOSEN = "Choose a destination";

type Props = MenuCascaderExampleProps;

const props = defineProps<Props>();

const path = useModel(props, "path");

const pathText = computed(() => (path.value.length > 0 ? path.value.join(PATH_SEPARATOR) : NOTHING_CHOSEN));

const activate = (destination: Destination) => {
    if (destination.isLeaf) path.value = destination.path;
};
</script>

<template>
    <Menu
        :items="DESTINATIONS"
        :ariaLabel="`Destination: ${pathText}`"
        :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
        @activate="activate"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">{{ pathText }}</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuDestinationItem :item="item" :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
