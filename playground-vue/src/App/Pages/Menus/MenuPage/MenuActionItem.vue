<script setup lang="ts">
import PageMenuItemContent from "../../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import type { MenuActionItemProps } from "./MenuPage.types";

defineProps<MenuActionItemProps>();
</script>

<template>
    <PageMenuItemContent is-gliding :flags="flags" :kind="item.kind" :shortcut="item.value.shortcut ?? ''">{{
        item.value.name
    }}</PageMenuItemContent>
</template>
