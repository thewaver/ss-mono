<script setup lang="ts">
import PageMenuItemContent from "../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import type { MenubarItemProps } from "./MenubarPage.types";

defineProps<MenubarItemProps>();
</script>

<template>
    <PageMenuItemContent :flags="flags" :kind="item.kind" :shortcut="item.value.shortcut ?? ''">{{
        item.value.name
    }}</PageMenuItemContent>
</template>
