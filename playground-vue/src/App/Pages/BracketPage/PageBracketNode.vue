<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import type { PageBracketNodeProps } from "./BracketPage.types";

const ROOT_LAYER = 0;

defineProps<PageBracketNodeProps>();
</script>

<template>
    <div
        :class="[
            styles.node,
            state.isFocused && styles.nodeFocused,
            state.isOnFocusedRoute && styles.nodeOnRoute,
            state.placement.layer === ROOT_LAYER && styles.nodeRoot,
            state.placement.isDisabled && styles.nodeDisabled,
        ]"
    >
        {{ node.value }}
    </div>
</template>
