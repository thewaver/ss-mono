<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import type { PageDieFaceProps } from "./DieContent.types";

const LABEL_SHARE = 0.35;

defineProps<PageDieFaceProps>();
</script>

<template>
    <div
        :class="[styles.dieFace, state.isShowing && styles.dieFaceShowing]"
        :style="{
            fontSize: `${Math.min(state.size.width, state.size.height) * LABEL_SHARE}px`,
        }"
        aria-hidden="true"
    >
        {{ label }}
    </div>
</template>
