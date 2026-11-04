<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

import type { SkinStateProps } from "./SkinsPage.types";

defineProps<SkinStateProps>();
</script>

<template>
    <div :class="styles.skinBarCell">
        <div :class="styles.skinBarCaption">{{ state }}</div>

        <slot />
    </div>
</template>
