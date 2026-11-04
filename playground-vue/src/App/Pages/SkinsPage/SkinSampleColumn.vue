<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { SkinSampleColumnProps } from "./SkinsPage.types";

defineProps<SkinSampleColumnProps>();
</script>

<template>
    <div :class="[styles.skinColumn, isWide && styles.skinWideColumn]">
        <PageLayer :level="1">
            <div :class="styles.skinColumnName">{{ name }}</div>

            <slot />
        </PageLayer>
    </div>
</template>
