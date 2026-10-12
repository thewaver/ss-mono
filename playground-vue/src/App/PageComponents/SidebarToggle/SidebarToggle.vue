<script setup lang="ts">
import { InteractionWrapper } from "@thewaver/ss-components-vue";

import PageSidebarToggleButton from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton.vue";
import type { SidebarToggleProps } from "./SidebarToggle.types";

const props = defineProps<SidebarToggleProps>();

const handleClick = () => {
    if (!props.isDisabled) props.onToggle();
};
</script>

<template>
    <InteractionWrapper :is-disabled="isDisabled">
        <template #renderControl="{ setElementRef, flags }">
            <PageSidebarToggleButton
                :ref="setElementRef"
                :flags="flags"
                :edge="edge"
                :is-expanded="isExpanded"
                :aria-label="ariaLabel"
                :aria-expanded="isExpanded"
                :aria-controls="sidebarId"
                :aria-disabled="isDisabled || undefined"
                @click="handleClick"
            />
        </template>
    </InteractionWrapper>
</template>
