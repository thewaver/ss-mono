<script setup lang="ts">
import PageLayer from "../../PageComponents/Layer/Layer.vue";
import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import type { MenubarPopupProps } from "./MenubarPage.types";

defineProps<MenubarPopupProps>();
</script>

<template>
    <PageLayer :level="2">
        <PagePopoverSurface
            :visibility-target="visibilityTarget"
            :transition-duration-ms="transitionDurationMs"
            :placement="placement"
        >
            <component :is="renderItems" />
        </PagePopoverSurface>
    </PageLayer>
</template>
