<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

import { useIsPreview } from "../Preview/Preview.context";

const isPreview = useIsPreview();
</script>

<template>
    <div v-if="!isPreview" :class="styles.propsGroups"><slot /></div>
</template>
