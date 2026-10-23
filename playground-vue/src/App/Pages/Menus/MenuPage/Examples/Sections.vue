<script setup lang="ts">
import { useModel } from "vue";

import { Menu } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuGroupBox from "../../../../StyledComponents/MenuItemContent/PageMenuGroupBox.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import PageSelectGroupContent from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { SECTIONED_VIEW_OPTIONS } from "../MenuPageVue.const";
import type { Action, MenuExampleProps } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps & { "checked": Action[]; "onUpdate:checked"?: (checked: Action[]) => void };

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Menu
        v-model:checked="checked"
        :items="SECTIONED_VIEW_OPTIONS"
        ariaLabel="View options"
        @activate="props.onActivate"
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
</template>
