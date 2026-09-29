<script setup lang="ts">
import { EdgeFader } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

type Props = EdgeFaderExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.autoHeightFrame">
        <EdgeFader :size="size" :is-scroll-aware="isScrollAware">
            <div :class="styles.card">
                <h3 :class="styles.cardTitle">Nothing to scroll</h3>
                <p :class="styles.cardText">
                    This card fits its box, so it only fades while the fade is fixed. Turn on scroll-aware and the edges
                    come back sharp, because there is nothing further to reach in any direction.
                </p>
            </div>
        </EdgeFader>
    </div>
</template>
