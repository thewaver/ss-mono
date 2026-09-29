<script setup lang="ts">
import { EdgeFader } from "@thewaver/ss-components-vue";
import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

type Props = EdgeFaderExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.frame">
        <EdgeFader :edges="['top', 'bottom']" ariaLabel="Rows" :size="size" :is-scroll-aware="isScrollAware">
            <div :class="styles.column">
                <div v-for="label in COLUMN_ROWS" :key="label" :class="styles.row">{{ label }}</div>
            </div>
        </EdgeFader>
    </div>
</template>
