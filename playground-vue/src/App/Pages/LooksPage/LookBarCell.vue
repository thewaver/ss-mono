<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

import type { LookStateProps } from "./LooksPage.types";

defineProps<LookStateProps>();
</script>

<template>
    <div :class="styles.lookBarCell">
        <div :class="styles.lookBarCaption">{{ state }}</div>

        <slot />
    </div>
</template>
