<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import type { PageDieIconProps } from "./DieContent.types";

const ICON_SHARE = 0.5;

defineProps<PageDieIconProps>();
</script>

<template>
    <div
        :class="styles.dieIcon"
        :style="{ fontSize: `${Math.min(state.size.width, state.size.height) * ICON_SHARE}px` }"
        aria-hidden="true"
    >
        {{ icon }}
    </div>
</template>
