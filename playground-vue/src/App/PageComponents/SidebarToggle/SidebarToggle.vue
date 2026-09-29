<script setup lang="ts">
import { InteractionWrapper } from "@thewaver/ss-components-vue";

import PageSidebarToggleButton from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton.vue";
import type { SidebarToggleProps } from "./SidebarToggle.types";

const props = defineProps<SidebarToggleProps>();
</script>

<template>
    <InteractionWrapper>
        <template #renderControl="{ setElementRef, flags }">
            <PageSidebarToggleButton
                :ref="setElementRef"
                :flags="flags"
                :edge="edge"
                :is-expanded="isExpanded"
                :aria-label="ariaLabel"
                :aria-expanded="isExpanded"
                :aria-controls="sidebarId"
                @click="props.onToggle()"
            />
        </template>
    </InteractionWrapper>
</template>
