<script setup lang="ts">
import { ROOT_LAYER } from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import type { PageBracketNodeProps } from "./BracketPage.types";

defineProps<PageBracketNodeProps>();
</script>

<template>
    <div
        :class="[
            styles.node,
            state.isOnFocusedRoute && styles.nodeOnRoute,
            state.placement.layer === ROOT_LAYER && styles.nodeRoot,
            state.placement.isDisabled && styles.nodeDisabled,
        ]"
    >
        {{ node.value }}
    </div>
</template>
