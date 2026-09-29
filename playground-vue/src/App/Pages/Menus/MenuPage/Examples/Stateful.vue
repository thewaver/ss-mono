<script setup lang="ts">
import { useModel } from "vue";

import { Menu } from "@thewaver/ss-components-vue";

import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { VIEW_OPTIONS } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps & { "checked": Action[]; "onUpdate:checked"?: (checked: Action[]) => void };

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Menu v-model:checked="checked" :items="VIEW_OPTIONS" ariaLabel="View options" @activate="props.onActivate">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">View</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
