<script setup lang="ts">
import { computed } from "vue";

import {
    OPEN_TOWARDS_LEFT,
    OPEN_TOWARDS_RIGHT,
} from "@thewaver/ss-playground/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SidebarToggleButtonProps } from "./SidebarToggleButton.types";

const props = defineProps<SidebarToggleButtonProps>();

const layerClass = useLayerClass();

const isPointingRight = computed(() => (props.edge === "left") !== props.isExpanded);
</script>

<template>
    <button
        type="button"
        :class="[
            styles.sidebarToggle,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <span aria-hidden="true">{{ isPointingRight ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT }}</span>
    </button>
</template>
