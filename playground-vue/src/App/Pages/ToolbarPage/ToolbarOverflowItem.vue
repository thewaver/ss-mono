<script setup lang="ts">
import PageMenuItemContent from "../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import type { ToolbarOverflowItemProps } from "./ToolbarPage.types";

defineProps<ToolbarOverflowItemProps>();
</script>

<template>
    <PageMenuItemContent :flags="flags" :kind="item.kind">{{ item.value }}</PageMenuItemContent>
</template>
