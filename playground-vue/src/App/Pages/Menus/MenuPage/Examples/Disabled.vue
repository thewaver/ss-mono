<script setup lang="ts">
import { Menu } from "@thewaver/ss-components-vue";

import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPage.const";
import MenuPopup from "../MenuPopup.vue";
</script>

<template>
    <Menu :items="ACTIONS" is-disabled ariaLabel="Edit actions" @activate="() => undefined">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
