<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/CodeBox/CodeBox.css";

import type { PageCodeBoxProps } from "./CodeBox.types";

defineProps<PageCodeBoxProps>();
</script>

<template>
    <div :class="styles.codeBoxRoot">
        <div :class="styles.codeBoxContent" v-html="source" />
    </div>
</template>
