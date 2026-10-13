<script setup lang="ts">
import { BADGE_GLYPH } from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PropHintBadgeProps } from "./PropHintBadgeVue.types";

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
