<script setup lang="ts">
import PageMenuItemContent from "../../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import type { MenuActionItemProps } from "./MenuPageVue.types";

defineProps<MenuActionItemProps>();
</script>

<template>
    <PageMenuItemContent has-hover-floater :flags="flags" :kind="item.kind" :shortcut="item.value.shortcut ?? ''">{{
        item.value.name
    }}</PageMenuItemContent>
</template>
