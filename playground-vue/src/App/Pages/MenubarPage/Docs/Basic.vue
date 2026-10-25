<script setup lang="ts">
import { shallowRef } from "vue";

import { Menubar } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenubarItem from "../MenubarItem.vue";
import type { MenubarEntry } from "../MenubarPage.types";
import { NOTHING_PICKED, VIEW_DEFAULTS, WORDS } from "../MenubarPageVue.const";
import MenubarPopup from "../MenubarPopup.vue";

const layerClass = useLayerClass();

const checked = shallowRef(VIEW_DEFAULTS);
const lastPicked = shallowRef(NOTHING_PICKED);
</script>

<template>
    <div :class="[styles.bar, styles.wideBar, layerClass]">
        <Menubar
            v-model:checked="checked"
            :actions="WORDS"
            ariaLabel="Editor"
            overflowAriaLabel="More menus"
            :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
            @activate="(entry: MenubarEntry) => (lastPicked = entry.name)"
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
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last picked: ${lastPicked}` }}</div>
</template>
