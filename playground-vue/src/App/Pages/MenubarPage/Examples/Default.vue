<script setup lang="ts">
import { useModel } from "vue";

import { Menubar } from "@thewaver/ss-components-vue";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenubarItem from "../MenubarItem.vue";
import { WORDS } from "../MenubarPage.const";
import type { MenubarExampleProps } from "../MenubarPage.types";
import MenubarPopup from "../MenubarPopup.vue";

type Props = MenubarExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Menubar
        v-model:checked="checked"
        :actions="WORDS"
        ariaLabel="Editor"
        overflowAriaLabel="More menus"
        :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
        @activate="props.onActivate"
    >
        <template #renderAction="{ action, flags }">
            <PageMenuTriggerContent :flags="flags">{{ action.value.name }}</PageMenuTriggerContent>
        </template>

        <template #renderOverflowTrigger="flags">
            <PageMenuTriggerContent :flags="flags">More</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenubarItem :item="item" :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <MenubarPopup v-bind="popup" />
        </template>
    </Menubar>
</template>
