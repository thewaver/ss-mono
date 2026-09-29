<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PropHintBadgeProps } from "./PropHintBadge.types";

const BADGE_GLYPH = "?";

defineProps<PropHintBadgeProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.propHintBadge,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
        ]"
    >
        {{ BADGE_GLYPH }}
    </div>
</template>
