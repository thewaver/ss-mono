<script setup lang="ts">
import { shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuGroupBox from "../../../../StyledComponents/MenuItemContent/PageMenuGroupBox.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageSelectGroupContent from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { NOTHING_RUN, SECTIONED_VIEW_OPTIONS, VIEW_DEFAULTS } from "../MenuPageVue.const";
import type { Action } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const checked = shallowRef<Action[]>(VIEW_DEFAULTS);
const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <Menu
        v-model:checked="checked"
        :items="SECTIONED_VIEW_OPTIONS"
        ariaLabel="View options"
        @activate="(action: Action) => (lastRun = action.name)"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">View</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderGroupHeader="{ group }">
            <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
        </template>

        <template #renderGroupBox="{ renderContent }">
            <PageMenuGroupBox><component :is="renderContent" /></PageMenuGroupBox>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
