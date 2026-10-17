<script setup lang="ts">
import { FLYOUT_MENU_CHEVRON } from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlyoutMenuToggleProps } from "./FlyoutMenuContentVue.types";

defineProps<FlyoutMenuToggleProps>();

const layerClass = useLayerClass();
</script>

<template>
    <span
        :class="[
            styles.flyoutMenuToggle,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isOpen && styles.isOpen,
        ]"
    >
        <span :class="styles.flyoutMenuChevron" aria-hidden="true">{{ FLYOUT_MENU_CHEVRON }}</span>
    </span>
</template>
