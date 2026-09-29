<script setup lang="ts">
import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import type { SelectPopupProps } from "./SelectPage.types";

defineProps<SelectPopupProps>();
</script>

<template>
    <PagePopoverSurface
        :visibility-target="visibilityTarget"
        :transition-duration-ms="transitionDurationMs"
        :placement="placement"
    >
        <component :is="renderOptions" />
    </PagePopoverSurface>
</template>
