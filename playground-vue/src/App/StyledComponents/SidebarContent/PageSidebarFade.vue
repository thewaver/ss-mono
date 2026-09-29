<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

import type { SidebarFadeProps } from "./SidebarContent.types";

defineProps<SidebarFadeProps>();
</script>

<template>
    <div
        :class="[
            styles.sidebarFade,
            (phase === 'collapsing' || phase === 'collapsed') && styles.isFaded,
            phase === 'collapsed' && styles.isHidden,
        ]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
    >
        <slot />
    </div>
</template>
