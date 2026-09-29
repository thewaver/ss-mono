<script setup lang="ts">
import { EdgeFader } from "@thewaver/ss-components-vue";
import { STRIP_CHIPS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

type Props = EdgeFaderExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.autoHeightFrame">
        <EdgeFader :edges="['left', 'right']" ariaLabel="Items" :size="size" :is-scroll-aware="isScrollAware">
            <div :class="styles.strip">
                <div v-for="label in STRIP_CHIPS" :key="label" :class="styles.chip">{{ label }}</div>
            </div>
        </EdgeFader>
    </div>
</template>
