<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlyoutMenuLinkProps } from "./FlyoutMenuContentVue.types";

defineProps<FlyoutMenuLinkProps>();

const layerClass = useLayerClass();
</script>

<template>
    <span
        :class="[
            styles.flyoutMenuLink,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isCurrent && styles.isCurrent,
        ]"
    >
        <slot />
    </span>
</template>
