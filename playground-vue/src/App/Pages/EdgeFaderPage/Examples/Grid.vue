<script setup lang="ts">
import { EdgeFader } from "@thewaver/ss-components-vue";
import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

type Props = EdgeFaderExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.frame">
        <EdgeFader ariaLabel="Tiles" :size="size" :is-scroll-aware="isScrollAware">
            <div :class="styles.grid">
                <div v-for="label in GRID_TILES" :key="label" :class="styles.tile">{{ label }}</div>
            </div>
        </EdgeFader>
    </div>
</template>
