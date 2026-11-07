<script setup lang="ts">
import PageMenuItemContent from "../../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import type { MenuDestinationItemProps } from "./MenuPageVue.types";

defineProps<MenuDestinationItemProps>();
</script>

<template>
    <PageMenuItemContent has-hover-floater :flags="flags" :kind="item.kind" shortcut="">{{
        item.value.name
    }}</PageMenuItemContent>
</template>
