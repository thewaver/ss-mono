<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SidebarToggleButtonProps } from "./SidebarToggleButton.types";

const OPEN_TOWARDS_RIGHT = "›";
const OPEN_TOWARDS_LEFT = "‹";

const props = defineProps<SidebarToggleButtonProps>();

const layerClass = useLayerClass();

const isPointingRight = computed(() => (props.edge === "left") !== props.isExpanded);
</script>

<template>
    <button type="button" :class="[styles.sidebarToggle, layerClass, flags.isHovered && styles.isHovered]">
        <span aria-hidden="true">{{ isPointingRight ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT }}</span>
    </button>
</template>
