<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { LookSampleColumnProps } from "./LooksPage.types";

defineProps<LookSampleColumnProps>();
</script>

<template>
    <div :class="[styles.lookColumn, isWide && styles.lookWideColumn]">
        <PageLayer :level="1">
            <div :class="styles.lookColumnName">{{ name }}</div>

            <slot />
        </PageLayer>
    </div>
</template>
