<script setup lang="ts">
import { shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { NESTED_ACTIONS, NOTHING_RUN } from "../MenuPageVue.const";
import type { Action } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <div dir="rtl">
        <Menu
            :items="NESTED_ACTIONS"
            ariaLabel="File actions"
            :submenu-offset="{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }"
            @activate="(action: Action) => (lastRun = action.name)"
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
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
